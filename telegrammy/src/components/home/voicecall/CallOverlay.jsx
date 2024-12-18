import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useSocket } from '../../../contexts/SocketContext';
import { useCallContext } from '../../../contexts/CallContext';

import {
  closeOverlay,
  connectingCall,
  callConnected,
  declineCall,
  endCall,
  incomingCall,
  toggleMuteaction,
} from '../../../slices/callSlice';

import CallButtons from './CallButtons';
import { IoClose } from 'react-icons/io5';

// ICE servers configuration
const iceServers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const CallOverlay = ({ localAudioRef, remoteAudioRef }) => {
  const { socketGeneralRef } = useSocket();
  const { endCallFromCallerRef, muteRef } = useCallContext();

  const dispatch = useDispatch();

  const peerConnectionRef = useRef(null);

  const {
    participants,
    callState,
    callTime,
    isCallOverlayOpen,
    chatId,
    callID,
    isMute,
  } = useSelector((state) => state.call);

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  //////////////////////////////////////////

  const pictureToShow = chatId?.isGroup
    ? chatId?.groupId.image
    : currentUserId === chatId?.participants[0].userId._id
      ? chatId?.participants[1].userId.picture
      : chatId?.participants[0].userId.picture;
  const nameToShow = chatId?.isGroup
    ? chatId?.groupId.name
    : currentUserId === chatId?.participants[0].userId._id
      ? chatId?.participants[1].userId.username
      : chatId?.participants[0].userId.username;

  const handleAccept = async () => {
    if (peerConnectionRef.current && callState !== 'no call') {
      console.log('Accepting call');
      const answer = await peerConnectionRef.current.createAnswer();

      console.log('answer: ', answer);

      await peerConnectionRef.current
        .setLocalDescription(answer)
        .then(() =>
          console.log(
            'Local description set:',
            peerConnectionRef.current.localDescription,
          ),
        )
        .catch((err) => console.error('Error setting local description:', err));

      // IMPORTANT: ICE candidate handler
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Callee ICE candidate:', event.candidate);
          socketGeneralRef.current.emit(
            'call:addMyIce',
            {
              callId: callID,
              IceCandidate: event.candidate,
            },
            (response) => {
              if (response.status === 'ok') {
                console.log('ICE from callee candidate sent');
              } else {
                console.error('ICE sending error', response.message);
              }
            },
          );
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          'Connection State:',
          peerConnectionRef.current.connectionState,
        );

        if (peerConnectionRef.current.connectionState === 'connected') {
          console.log('Call is active.');
          dispatch(callConnected());
        } else if (peerConnectionRef.current.connectionState === 'connecting') {
          console.log('Call is connecting.');
          dispatch(connectingCall());
        }
      };

      socketGeneralRef.current.emit(
        'call:answer',
        { callId: callID, answer },
        (response) => {
          if (response.status === 'ok') {
            console.log('send accepted successfully');
          } else {
            console.error('error', response.message);
          }
        },
      );
    }
  };

  const handleDecline = () => {
    console.log('Declining call');
    socketGeneralRef.current.emit(
      'call:reject',
      { callId: callID },
      (response) => {
        if (response.status === 'ok') {
          console.log('Call rejected');
          dispatch(declineCall());
          cleanup();
        } else {
          console.error('error', response.message);
        }
      },
    );
  };

  const handleEndCall = () => {
    if (currentUserId === participants[0]?.userId) {
      console.log('Ending call from caller');
      endCallFromCallerRef.current.click();
    } else {
      console.log('Ending call from callee');
      socketGeneralRef.current.emit(
        'call:end',
        { callId: callID, status: 'ended' },
        (response) => {
          if (response.status === 'ok') {
            console.log('Call ended successfully from callee');
            dispatch(endCall());
            cleanup();
          } else {
            console.error('error: ', response.message);
          }
        },
      );
    }
  };

  const handleCloseOverlay = () => {
    if (callState === 'callDeclined') {
      dispatch(endCall());
    } else {
      dispatch(closeOverlay());
    }
  };

  const toggleMute = () => {
    console.log(currentUserId, participants[0]?.userId);
    if (currentUserId === participants[0]?.userId) {
      console.log('mute from caller');
      muteRef.current.click();
      dispatch(toggleMuteaction());
    } else {
      if (callState === 'in call' && localAudioRef.current.srcObject) {
        console.log('mute from callee');
        console.log('Muting/unmuting audio from callee');
        localAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
          track.enabled = !track.enabled;
        });
        dispatch(toggleMuteaction());
      }
    }
  };

  /////////////////////////// need to handle decline and end when refresh page ///////////////////////////

  const cleanup = () => {
    // Close peer connection and stop local stream
    console.log('Cleaning up call');

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localAudioRef.current?.srcObject) {
      localAudioRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localAudioRef.current.srcObject = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  };

  // listen for sockets events
  useEffect(() => {
    const handleIncomingOffer = async (response) => {
      // Check if the current user is part of the call
      // neeed to change after backend edit it

      console.log('Incoming call');

      // Create PeerConnection
      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = peerConnection;

      // Add track listener for remote stream
      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote track:', event.track);

        remoteAudioRef.current.srcObject = event.streams[0];
      };

      // Add local audio stream
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
        console.log('local track added', track);
      });

      localAudioRef.current.srcObject = localStream;

      // Set remote description first
      await peerConnectionRef.current.setRemoteDescription(
        response.callObj.offer,
      );

      dispatch(
        incomingCall({
          participants: response.participants,
          chatId: response.chatId,
          callID: response._id,
        }),
      );
    };

    const handleIncomingICE = (response) => {
      console.log('Adding ICE candidate from caller before if');
      if (peerConnectionRef.current) {
        console.log('Adding ICE candidate from caller');

        const ices = response.callObj.offererIceCandidate;
        console.log(
          'adding ICE candidate from callee after handleIncomingOffer',
          ices,
        );
        ices.forEach((ice) => {
          peerConnectionRef.current
            .addIceCandidate(ice)
            .catch((err) =>
              console.error(
                'Error adding ICE candidate -> handleIncomingICE caller:',
                err,
              ),
            );
        });
      }
    };

    const handleEndCallFromCaller = (response) => {
      if (peerConnectionRef.current) {
        console.log('call state from end event in callee', callState);
        console.log('Call ended from end event in callee');
        cleanup();
        dispatch(endCall());
      }
    };

    try {
      // Register socketGeneralRef listeners
      socketGeneralRef.current.on('call:incomingCall', handleIncomingOffer);
      socketGeneralRef.current.on('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.on('call:endedCall', handleEndCallFromCaller);
    } catch (error) {
      console.error(error);
    }

    return () => {
      // Cleanup socketGeneralRef listeners
      socketGeneralRef.current.off('call:incomingCall', handleIncomingOffer);
      socketGeneralRef.current.off('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.off('call:endedCall', handleEndCallFromCaller);

      // Cleanup PeerConnection
      cleanup();
    };
  }, [socketGeneralRef]);

  if (callState === 'no call' || !isCallOverlayOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative flex h-[50%] w-[40%] flex-col justify-around rounded-lg bg-bg-secondary p-10 text-center shadow-lg">
        <button
          onClick={handleCloseOverlay}
          data-test-id="close-call-overlay-button"
          className="absolute right-4 top-4 text-text-primary"
        >
          <IoClose size={24} />
        </button>

        <div>
          <img
            src={pictureToShow || 'https://via.placeholder.com/100'}
            alt="Participant"
            className="mx-auto mb-4 h-24 w-24 rounded-full"
          />
          <h2>{nameToShow || 'Caller'}</h2>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {callState === 'in call' ? `In Call: ${callTime}` : callState}
        </h2>

        {callState !== 'callDeclined' && (
          <CallButtons
            handleAccept={handleAccept}
            handleDecline={handleDecline}
            handleEndCall={handleEndCall}
            toggleMute={toggleMute}
            isMute={isMute}
          />
        )}
      </div>
    </div>
  );
};

export default CallOverlay;
