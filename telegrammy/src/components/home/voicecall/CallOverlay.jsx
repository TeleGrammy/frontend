import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useSocket } from '../../../contexts/SocketContext';

import {
  closeOverlay,
  openOverlay,
  connectingCall,
  callConnected,
  declineCall,
  endCall,
  incomingCall,
} from '../../../slices/callSlice';

import CallButtons from './CallButtons';
import { IoClose } from 'react-icons/io5';

// ICE servers configuration
const iceServers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const CallOverlay = () => {
  const { socketGeneralRef } = useSocket();
  const dispatch = useDispatch();

  const [isMuted, setIsMuted] = useState(false);

  const peerConnectionRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const {
    participants,
    callState,
    callTime,
    isCallOverlayOpen,
    chatId,
    endCallFromCallerRef,
    callID,
    muteRef,
  } = useSelector((state) => state.call);

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  const pictureToShow = chatId?.isGroup
    ? chatId?.groupId.image
    : currentUserId === chatId?.participants[0]._id
      ? chatId?.participants[1].picture
      : chatId?.participants[0].picture;
  const nameToShow = chatId?.isGroup
    ? chatId?.groupId.name
    : currentUserId === chatId?.participants[0]._id
      ? chatId?.participants[1].username
      : chatId?.participants[0].username;

  const handleAccept = async () => {
    if (peerConnectionRef.current && callState !== 'no call') {
      console.log('Accepting call');
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketGeneralRef.current.emit(
        'call:answer',
        { callId: callID, answer },
        (response) => {
          if (response.status === 'ok') {
            console.log('send accepted successfully');
            peerConnectionRef.current.onconnectionstatechange = () => {
              console.log(
                'Connection State:',
                peerConnectionRef.current.connectionState,
              );

              if (peerConnectionRef.current.connectionState === 'connected') {
                console.log('Call is active.');
                dispatch(callConnected());
              } else if (
                peerConnectionRef.current.connectionState === 'connecting'
              ) {
                console.log('Call is connecting.');
                dispatch(connectingCall());
              }
            };
          } else {
            console.log('error', response.message);
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
          console.log('error', response.message);
        }
      },
    );
  };

  const handleEndCall = () => {
    if (currentUserId === participants[0]?._id) {
      console.log('Ending call from caller');
      endCallFromCallerRef.current.click();
    } else {
      console.log('Ending call from callee');
      socketGeneralRef.current.emit(
        'call:end',
        { callId: callID, status: 'ended' },
        (response) => {
          if (response.status === 'ok') {
            console.log('Call ended');
            dispatch(endCall());
            cleanup();
          } else {
            console.log('error', response.message);
          }
        },
      );
    }
  };

  const handleCloseOverlay = () => {
    if (callState === 'callDeclined') {
      dispatch(endCall());
    }
    dispatch(closeOverlay());
  };

  const toggleMute = () => {
    if (currentUserId === participants[0]?._id) {
      muteRef.current.click();
      setIsMuted((prev) => !prev);
    } else {
      if (callState === 'in call' && localAudioRef.current.srcObject) {
        localAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
          track.enabled = !track.enabled;
          setIsMuted((prev) => !prev);
        });
      }
    }
  };

  const cleanup = () => {
    // Close PeerConnection and stop media tracks
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

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
      if (callState !== 'no call') return;

      console.log('Incoming call');

      dispatch(
        incomingCall({
          participants: response.participants,
          chatId: response.chatId,
          callID: response._id,
        }),
      );

      // Create PeerConnection
      peerConnectionRef.current = new RTCPeerConnection(iceServers);

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
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
                console.log('error', response.message);
              }
            },
          );
        }
      };

      // Add track listener for remote stream
      peerConnectionRef.current.ontrack = (event) => {
        remoteAudioRef.current.srcObject = event.streams[0];
      };

      // Add local audio stream
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localAudioRef.current.srcObject = localStream;
      localStream
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localStream),
        );

      // Set remote description
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(response.callObj.offer),
      );
    };

    const handleIncomingICE = (response) => {
      if (
        callState === 'no call' ||
        response.callObj.senderId === currentUserId
      )
        return;
      if (peerConnectionRef.current) {
        console.log('Adding ICE candidate from caller');
        peerConnectionRef.current
          .addIceCandidate(new RTCIceCandidate(response.callObj.participantICE))
          .catch((err) => console.error('Error adding ICE candidate:', err));
      }
    };

    const handleEndCallFromCaller = () => {
      if (callState === 'no call') return;
      console.log('Call ended by caller');
      dispatch(endCall());
      cleanup();
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
            isMuted={isMuted}
          />
        )}
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
};

export default CallOverlay;
