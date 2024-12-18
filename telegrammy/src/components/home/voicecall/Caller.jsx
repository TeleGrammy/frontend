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
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function Caller() {
  const { socketGeneralRef } = useSocket();
  const { endCallFromCallerRef, muteRef } = useCallContext();

  const dispatch = useDispatch();

  const { callState, callID } = useSelector((state) => state.call);

  const { openedChat } = useSelector((state) => state.chats);

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  const peerConnectionRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const createCall = () => {
    console.log('creating call');
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
          handleCall(response.call._id);
        } else {
          console.log('error', response.message);
        }
      },
    );
  };

  const handleCall = async (callid) => {
    if (callState !== 'no call') return;

    try {
      console.log('Starting call');
      // Create peer connection
      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = peerConnection;

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track);
        remoteAudioRef.current.srcObject = event.streams[0];
      };
      // Get local audio stream
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // Add local audio stream to peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
        console.log('local track added', track);
      });

      localAudioRef.current.srcObject = localStream;

      // Create and send an offer
      const offer = await peerConnection.createOffer();

      await peerConnection
        .setLocalDescription(offer)
        .then(() =>
          console.log(
            'Local description set:',
            peerConnection.localDescription,
          ),
        )
        .catch((err) => console.error('Error setting local description:', err));

      console.log('sending offer');

      socketGeneralRef.current.emit(
        'call:newCall',
        {
          callId: callid,
          offer,
        },
        (response) => {
          if (response.status === 'ok') {
            console.log('Offer sent');
          } else {
            console.log('error', response.message);
          }
        },
      );

      // IMPORTANT: Add this to ensure ICE candidates are generated
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Caller ICE candidate:', event.candidate);
          console.log('callid: ', callid);
          socketGeneralRef.current.emit(
            'call:addMyIce',
            {
              callId: callid,
              IceCandidate: event.candidate,
            },
            (response) => {
              if (response.status === 'ok') {
                console.log('ICE from caller candidate sent');
              } else {
                console.error('ICE sending error', response.message);
              }
            },
          );
        }
      };

      peerConnection.onconnectionstatechange = () => {
        console.log('Connection State:', peerConnection.connectionState);

        if (peerConnection.connectionState === 'connected') {
          console.log('Call is active.');
          dispatch(callConnected());
        } else if (peerConnection.connectionState === 'connecting') {
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
      console.log('Ending call from caller');
      socketGeneralRef.current.emit(
        'call:end',
        { callId: callID, status: 'ended' },
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
    // need to change for groups check for recieved id to add answer of it to its peer connection
    // sender id -> caller id
    // reciever id -> callee id
    const handleAcceptCall = (response) => {
      console.log('handleAcceptCall');
      if (!peerConnectionRef.current.remoteDescription) {
        console.log('call has been accepted from callee');

        peerConnectionRef.current.setRemoteDescription(response.callObj.answer);

        dispatch(updateParticipants(response.participants));
      }
    };
    // need to check in group calls
    const handleRejectCall = (response) => {};

    // need to check
    const handleIncomingICE = (response) => {
      if (peerConnectionRef.current) {
        console.log('adding ICE candidate from callee');
        const ices = response.callObj.answererIceCandiate;
        console.log(
          'adding ICE candidate from callee after handleAcceptCall',
          ices,
        );
        ices.forEach((ice) => {
          peerConnectionRef.current
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
        console.log('call state from end event in caller', callState);
        console.log('Call ended from end event in caller');
        if (response.status === 'rejected') dispatch(calldeclined());
        else dispatch(endCall());
        console.log(response.status);
        cleanup();
      }
    };

    try {
      // Register socketGeneralRef listeners
      socketGeneralRef.current.on('call:answeredCall', handleAcceptCall);
      socketGeneralRef.current.on('call:rejectedCall', handleRejectCall);
      socketGeneralRef.current.on('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.on('call:endedCall', handleEndCallFromCallee);
    } catch (err) {
      console.error('Error listening for socketGeneralRef events:', err);
    }

    return () => {
      // Clean up socketGeneralRef listeners
      socketGeneralRef.current.off('call:answeredCall', handleAcceptCall);
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
