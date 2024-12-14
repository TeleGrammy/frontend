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
  const socket = useSocket();
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
    ? chatId?.groupId.groupName
    : currentUserId === chatId?.participants[0]._id
      ? chatId?.participants[1].username
      : chatId?.participants[0].username;

  const handleAccept = async () => {
    if (peerConnectionRef.current && callState !== 'no call') {
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.current.emit(
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
    socket.current.emit('call:reject', { callId: callID }, (response) => {
      if (response.status === 'ok') {
        console.log('Call rejected');
        dispatch(declineCall());
        cleanup();
      } else {
        console.log('error', response.message);
      }
    });
  };

  const handleEndCall = () => {
    if (currentUserId === participants[0]?._id) {
      endCallFromCallerRef.current.click();
    } else {
      socket.current.emit(
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

    setCallerInfo(null);
  };

  // listen for sockets events
  useEffect(() => {
    const handleIncomingOffer = async (response) => {
      // Check if the current user is part of the call
      // neeed to change after backend edit it
      if (!response.people.includes(currentUserId) || callState !== 'no call')
        return;

      // Create PeerConnection
      peerConnectionRef.current = new RTCPeerConnection(iceServers);

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(
            'call:addMyIce',
            {
              callId: callID,
              IceCandidate: event.candidate,
            },
            (response) => {
              if (response.status === 'ok') {
                console.log('ICE from caller candidate sent');
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

      dispatch(
        incomingCall({
          participants: response.participants,
          chatId: response.chatId,
          callID: response._id,
        }),
      );
    };

    const handleIncomingICE = (response) => {
      if (callState === 'no call' || response.senderId === currentUserId)
        return;
      if (peerConnectionRef.current) {
        peerConnectionRef.current
          .addIceCandidate(new RTCIceCandidate(response.callObj.IceCandidate))
          .catch((err) => console.error('Error adding ICE candidate:', err));
      }
    };

    const handleEndCallFromCaller = () => {
      if (callState === 'no call') return;
      dispatch(endCall());
      cleanup();
    };

    try {
      // Register socket listeners
      socket.current.on('call:incomingCall', handleIncomingOffer);
      socket.current.on('call:addedICE', handleIncomingICE);
      socket.current.on('call:endedCall', handleEndCallFromCaller);
    } catch (error) {
      console.error(error);
    }

    return () => {
      // Cleanup socket listeners
      socket.current.off('call:incomingCall', handleIncomingOffer);
      socket.current.off('call:addedICE', handleIncomingICE);
      socket.current.off('call:endedCall', handleEndCallFromCaller);

      // Cleanup PeerConnection
      cleanup();
    };
  }, [socket]);

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
