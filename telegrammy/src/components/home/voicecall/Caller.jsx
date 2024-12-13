import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  startCall,
  calldeclined,
  acceptCall,
  endCall,
} from '../../../slices/callSlice';

import { useSocket } from '../../../contexts/SocketContext';

import { IoMdCall } from 'react-icons/io';

function Caller() {
  const socket = useSocket();

  const dispatch = useDispatch();

  const { callState, callID } = useSelector((state) => state.call);

  const { openedChat } = useSelector((state) => state.chats);

  const peerConnectionRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const endCallFromCallerRef = useRef(null);

  const handleCall = async () => {
    if (callState !== 'no call') return;

    try {
      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = peerConnection;

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
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

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = new MediaStream([event.track]);
        }
      };

      // Get local audio stream
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localAudioRef.current.srcObject = localStream;

      // Add local audio stream to peer connection
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      // Create and send an offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.current.emit(
        'call:newCall',
        {
          chatId: openedChat.id,
          offer,
        },
        (response) => {
          if (response.status === 'ok') {
            dispatch(
              startCall({
                participants: response.call.participants,
                chatId: response.call.chatId,
                callID: response.call._id,
                endCallFromCallerRef: endCallFromCallerRef,
              }),
            );
          } else {
            console.log('error', response.message);
          }
        },
      );
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const endCall = () => {
    if (callState !== 'no call') {
      dispatch(endCall());
      cleanup();
      socket.current.emit(
        'call:end',
        { callId: callID, status: 'ended' },
        (response) => {
          if (response.status === 'ok') {
            console.log('Call ended');
          } else {
            console.log('error', response.message);
          }
        },
      );
    }
  };

  const cleanup = () => {
    // Close peer connection and stop local stream
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
    const handleAcceptCall = (data) => {
      peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );
    };

    const handleRejectCall = () => {
      cleanup();
    };

    const handleIncomingICE = (data) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current
          .addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch((err) => console.error('Error adding ICE candidate:', err));
      }
    };

    const handleEndCall = () => {
      dispatch(endCall());
      cleanup();
    };

    try {
      // Register socket listeners
      socket.current.on('call:answeredCall', handleAcceptCall);
      socket.current.on('call:rejectedCall', handleRejectCall);
      socket.current.on('call:addedICE', handleIncomingICE);
      socket.current.on('call:endedCall', handleEndCall);
    } catch (err) {
      console.error('Error listening for socket events:', err);
    }

    return () => {
      // Clean up socket listeners
      socket.current.off('call:answeredCall', handleAcceptCall);
      socket.current.off('call:rejectedCall', handleRejectCall);
      socket.current.off('call:addedICE', handleIncomingICE);
      socket.current.off('call:endedCall', handleEndCall);
      cleanup();
    };
  }, [socket]);

  return (
    <>
      <IoMdCall
        size={24}
        onClick={handleCall}
        className="cursor-pointer text-gray-600 hover:text-gray-900"
      />
      <audio ref={localAudioRef} autoPlay muted className="hidden"></audio>
      <audio ref={remoteAudioRef} autoPlay className="hidden"></audio>
      <button
        ref={endCallFromCallerRef}
        onClick={endCall}
        className="hidden"
      ></button>
    </>
  );
}

export default Caller;
