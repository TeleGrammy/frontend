import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  startCall,
  calldeclined,
  acceptCall,
  endCall,
  callConnected,
  connectingCall,
  updateParticipants,
} from '../../../slices/callSlice';

import { useSocket } from '../../../contexts/SocketContext';

import { IoMdCall } from 'react-icons/io';

// ICE servers configuration
const iceServers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function Caller() {
  const socket = useSocket();

  const dispatch = useDispatch();

  const { callState, callID } = useSelector((state) => state.call);

  const { openedChat } = useSelector((state) => state.chats);

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  const peerConnectionRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const endCallFromCallerRef = useRef(null);
  const muteRef = useRef(null);

  const handleCall = async () => {
    if (callState !== 'no call') return;

    try {
      // Create peer connection
      const peerConnection = new RTCPeerConnection(iceServers);
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
                muteRef: muteRef,
              }),
            );
          } else {
            console.log('error', response.message);
          }
        },
      );

      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          'Connection State:',
          peerConnectionRef.current.connectionState,
        );

        if (peerConnectionRef.current.connectionState === 'connected') {
          console.log('Call is active.');
          dispatch(callConnected());
        } else if (peerConnectionRef.current.connectionState === 'connecting') {
          console.log('Connecting call...');
          dispatch(connectingCall());
        }
      };
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const endCallEvent = () => {
    if (callState !== 'no call') {
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

  const handleMute = () => {
    if (callState === 'in call' && localAudioRef.current.srcObject) {
      localAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
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
    // need to change for groups and multiple participants calls (backend , frontend)
    const handleAcceptCall = (response) => {
      if (callState === 'no call') return;
      if (!peerConnectionRef.current.remoteDescription) {
        // Set the first valid answer
        peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(response.callObj.answer),
        );
        dispatch(updateParticipants(response.participants));
      }
    };
    // need to check in group calls
    const handleRejectCall = (response) => {};

    // need to check
    const handleIncomingICE = (response) => {
      if (callState === 'no call' || response.senderId === currentUserId)
        return;
      if (peerConnectionRef.current) {
        peerConnectionRef.current
          .addIceCandidate(new RTCIceCandidate(response.callObj.IceCandidate))
          .catch((err) => console.error('Error adding ICE candidate:', err));
      }
    };

    const handleEndCallFromCallee = (response) => {
      if (callState === 'no call') return;
      if (response.status === 'rejected') dispatch(calldeclined());
      else dispatch(endCall());
      cleanup();
    };

    try {
      // Register socket listeners
      socket.current.on('call:answeredCall', handleAcceptCall);
      socket.current.on('call:rejectedCall', handleRejectCall);
      socket.current.on('call:addedICE', handleIncomingICE);
      socket.current.on('call:endedCall', handleEndCallFromCallee);
    } catch (err) {
      console.error('Error listening for socket events:', err);
    }

    return () => {
      // Clean up socket listeners
      socket.current.off('call:answeredCall', handleAcceptCall);
      socket.current.off('call:rejectedCall', handleRejectCall);
      socket.current.off('call:addedICE', handleIncomingICE);
      socket.current.off('call:endedCall', handleEndCallFromCallee);
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
        onClick={endCallEvent}
        className="hidden"
      ></button>
      <button ref={muteRef} onClick={handleMute} className="hidden"></button>
    </>
  );
}

export default Caller;
