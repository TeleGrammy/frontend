import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  startCall,
  calldeclined,
  endCall,
  callConnected,
  connectingCall,
  updateParticipants,
} from '../../../slices/callSlice';

import { useSocket } from '../../../contexts/SocketContext';
import { useCallContext } from '../../../contexts/CallContext';

import { IoMdCall } from 'react-icons/io';

// ICE servers configuration
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.2.google.com:19302' },
    {
      urls: 'turn:35.152.90.211:3478',
      username: 'telegrammy',
      credential: 'telegrammycmp2026',
    },
  ],
};

function Caller() {
  const { socketGeneralRef } = useSocket();
  const { endCallFromCallerRef, muteRef } = useCallContext();

  const dispatch = useDispatch();

  const { callState, callID, chatId } = useSelector((state) => state.call);

  const { openedChat } = useSelector((state) => state.chats);

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const combinedRemoteStream = useRef(null);

  const callStateRef = useRef(callState);

  const createCall = () => {
    if (callState !== 'no call') return;

    console.log('creating call');

    peerConnectionRef.current = new Map();

    combinedRemoteStream.current = new MediaStream();

    socketGeneralRef.current.emit(
      'call:createCall',
      {
        chatId: openedChat.id,
      },
      (response) => {
        if (response.status === 'ok') {
          console.log('call created');
          dispatch(
            startCall({
              participants: response.call.participants,
              chatId: response.call.chatId,
              callID: response.call._id,
            }),
          );
          handleCall(response.call._id, response.call.chatId);
        } else {
          console.log('error', response.message);
        }
      },
    );
  };

  const handleCall = async (callid, chatId) => {
    if (callState !== 'no call') return;

    try {
      console.log('Starting group call');

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Add local stream to local audio reference
      localAudioRef.current.srcObject = localStream;

      // Iterate over participants (excluding the current user)
      const participants = chatId?.participants.filter(
        (participant) => participant.userId._id !== currentUserId,
      );

      console.log(participants);

      for (const participant of participants) {
        const recieverId = participant.userId._id;
        console.log(`Creating peer connection for receiver: ${recieverId}`);

        const peerConnection = new RTCPeerConnection(iceServers);

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
          console.log('Local track added for receiver:', recieverId);
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Caller ICE candidate:', event.candidate);
            socketGeneralRef.current.emit(
              'call:addIce',
              {
                callId: callid,
                recieverId,
                IceCandidate: event.candidate,
              },
              (response) => {
                if (response.status === 'ok') {
                  console.log(`ICE candidate sent for receiver: ${recieverId}`);
                } else {
                  console.error(
                    `Error sending ICE candidate for receiver: ${recieverId}`,
                    response.message,
                  );
                }
              },
            );
          }
        };

        peerConnection.onconnectionstatechange = () => {
          if (callStateRef.current !== 'in call') {
            if (peerConnection.connectionState === 'connected') {
              dispatch(callConnected());
            } else if (peerConnection.connectionState === 'connecting') {
              dispatch(connectingCall());
            }
          }
        };

        peerConnection.ontrack = (event) => {
          console.log('Received remote track from:', recieverId, event.track);
          combinedRemoteStream.current.addTrack(event.track);
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = combinedRemoteStream.current;
          }
        };

        console.log('creating offer');
        // Create and send an offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log(`Sending offer to receiver: ${recieverId}`);
        socketGeneralRef.current.emit(
          'call:offer',
          {
            callId: callid,
            recieverId,
            offer,
          },
          (response) => {
            if (response.status === 'ok') {
              console.log(`Offer sent to receiver: ${recieverId}`);
            } else {
              console.error(
                `Error sending offer to receiver: ${recieverId}`,
                response.message,
              );
            }
          },
        );

        // Store the peer connection in the ref
        peerConnectionRef.current.set(recieverId, peerConnection);
      }
    } catch (err) {
      console.error('Error starting group call:', err);
    }
  };

  const endCallEvent = () => {
    if (callState !== 'no call') {
      console.log('Ending call from caller');
      socketGeneralRef.current.emit(
        'call:end',
        { callId: callID },
        (response) => {
          if (response.status === 'ok') {
            console.log('Call ended from caller');
            dispatch(endCall());
            cleanup();
          } else {
            console.error('error', response.message);
          }
        },
      );
    }
  };

  const handleMute = () => {
    if (callState === 'in call' && localAudioRef.current.srcObject) {
      console.log('Muting/unmuting audio from caller');
      localAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  /////////////////////////// need to handle decline and end when refresh page ///////////////////////////

  const cleanup = () => {
    // Close peer connections and stop all local and remote streams for each participant
    console.log('Cleaning up call');

    if (peerConnectionRef.current) {
      Object.values(peerConnectionRef.current).forEach((peerConnection) => {
        // Close each peer connection
        peerConnection.close();
      });
      peerConnectionRef.current = null;
    }

    // Stop local audio stream
    if (localAudioRef.current?.srcObject) {
      localAudioRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localAudioRef.current.srcObject = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    combinedRemoteStream.current = null;

    console.log('Call resources cleaned up successfully.');
  };

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // listen for sockets events
  useEffect(() => {
    // need to change for groups check for recieved id to add answer of it to its peer connection
    // sender id -> caller id
    // reciever id -> callee id
    const handleIncomingAnswer = (response) => {
      if (peerConnectionRef.current) {
        console.log('handleAcceptCall');

        const senderId = response.senderId; // senderId is the ID of the participant who accepted the call
        const peerConnection = peerConnectionRef.current.get(senderId);

        if (!peerConnection.remoteDescription) {
          console.log('call has been accepted');

          peerConnection.setRemoteDescription(response.callObj.answer);

          dispatch(updateParticipants(response.participants));
        }
      }
    };
    // need to check in group calls
    const handleRejectCall = (response) => {};

    // need to check
    const handleIncomingICE = (response) => {
      if (peerConnectionRef.current) {
        const senderId = response.senderId; // senderId is the ID of the participant sending the ICE candidate
        const peerConnection = peerConnectionRef.current.get(senderId);

        const ices = response.iceCandidates;
        console.log(
          'adding ICE candidate from callee after handleAcceptCall',
          ices,
        );
        ices.forEach((ice) => {
          peerConnection
            .addIceCandidate(ice)
            .catch((err) =>
              console.error(
                'Error adding ICE candidate -> handleIncomingICE from callee:',
                err,
              ),
            );
        });
      }
    };

    const handleEndCallFromCallee = (response) => {
      if (peerConnectionRef.current) {
        console.log('Call ended from end event in caller');
        if (response.status === 'rejected') dispatch(calldeclined());
        else dispatch(endCall());
        console.log(response.status);
        cleanup();
      }
    };

    try {
      // Register socketGeneralRef listeners
      socketGeneralRef.current.on('call:incomingAnswer', handleIncomingAnswer);
      socketGeneralRef.current.on('call:rejectedCall', handleRejectCall);
      socketGeneralRef.current.on('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.on('call:endedCall', handleEndCallFromCallee);
    } catch (err) {
      console.error('Error listening for socketGeneralRef events:', err);
    }

    return () => {
      // Clean up socketGeneralRef listeners
      socketGeneralRef.current.off('call:incomingAnswer', handleIncomingAnswer);
      socketGeneralRef.current.off('call:rejectedCall', handleRejectCall);
      socketGeneralRef.current.off('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.off('call:endedCall', handleEndCallFromCallee);

      cleanup();
    };
  }, [socketGeneralRef]);

  return (
    <>
      <IoMdCall
        size={24}
        onClick={createCall}
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
