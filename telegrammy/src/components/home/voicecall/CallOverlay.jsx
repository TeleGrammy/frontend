import React, { useEffect, useRef } from 'react';
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
  updateParticipants,
} from '../../../slices/callSlice';

import CallButtons from './CallButtons';
import { IoClose } from 'react-icons/io5';

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

const CallOverlay = ({ localAudioRef, remoteAudioRef }) => {
  const { socketGeneralRef } = useSocket();
  const { endCallFromCallerRef, muteRef } = useCallContext();

  const dispatch = useDispatch();

  const peerConnectionRef = useRef(null);
  const combinedRemoteStream = useRef(null);

  const {
    participants,
    callState,
    callTime,
    isCallOverlayOpen,
    chatId,
    callID,
    isMute,
  } = useSelector((state) => state.call);

  const callStateRef = useRef(callState);

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

  ////////////////////////////////////////// handlers //////////////////////////////////////////

  const setupPeerConnection = async (participantId, localStream, callid) => {
    const peerConnection = new RTCPeerConnection(iceServers);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
        socketGeneralRef.current.emit(
          'call:addIce',
          {
            callId: callid,
            recieverId: participantId,
            IceCandidate: event.candidate,
          },
          (response) => {
            if (response.status === 'ok') {
              console.log(`ICE Candidate sent for ${participantId}`);
            } else {
              console.error('Error sending ICE Candidate:', response.message);
            }
          },
        );
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.track);
      combinedRemoteStream.current.addTrack(event.track);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = combinedRemoteStream.current;
      }
    };

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnectionRef.current.set(participantId, peerConnection);
    return peerConnection;
  };

  const handleAccept = async () => {
    if (peerConnectionRef.current && callState !== 'no call') {
      console.log('Accepting call');

      const participantsToIterate = chatId.participants;

      console.log('participantsToIterate', participantsToIterate);

      for (const participant of participantsToIterate) {
        if (participant.userId._id !== currentUserId) {
          const peerConnection = peerConnectionRef.current.get(
            participant.userId._id,
          );

          peerConnection.onconnectionstatechange = () => {
            if (callStateRef.current !== 'in call') {
              if (peerConnection.connectionState === 'connected') {
                dispatch(callConnected());
              } else if (peerConnection.connectionState === 'connecting') {
                dispatch(connectingCall());
              }
            }
          };

          const offer = await peerConnection.createOffer();

          socketGeneralRef.current.emit(
            'call:offer',
            {
              callId: callID,
              recieverId: participant.userId._id,
              offer,
            },
            async (response) => {
              console.log('ana hna', response);
              if (response.status === 'ok') {
                console.log('send offer successfully');
                await peerConnection.setLocalDescription(offer);
              } else if (response.status === 'offerExists') {
                console.log('offer already exists');
                const answer = await peerConnection.createAnswer();
                socketGeneralRef.current.emit(
                  'call:answer',
                  {
                    callId: callID,
                    answer,
                    recieverId: participant.userId._id,
                  },
                  async (response) => {
                    if (response.status === 'ok') {
                      console.log('send answer successfully');
                      await peerConnection.setLocalDescription(answer);
                    } else {
                      console.error('error', response.message);
                    }
                  },
                );
              } else {
                console.error('error', response.message);
              }
            },
          );
        }
      }
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
        { callId: callID },
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
    const handleIncomingCall = async (response, callback) => {
      if (peerConnectionRef.current) return;

      console.log('Incoming call');

      try {
        peerConnectionRef.current = new Map();
        combinedRemoteStream.current = new MediaStream();

        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localAudioRef.current.srcObject = localStream;

        for (const participant of response.chatId.participants) {
          if (participant.userId._id !== currentUserId) {
            await setupPeerConnection(
              participant.userId._id,
              localStream,
              response._id,
            );
          }
        }

        dispatch(
          incomingCall({
            participants: response.participants,
            chatId: response.chatId,
            callID: response._id,
          }),
        );
      } catch (error) {
        console.error(error);
      } finally {
        callback({ status: 'ready' });
      }
    };

    const handleIncomingOffer = async (response) => {
      if (peerConnectionRef.current) {
        console.log('Incoming offer');

        const senderId = response.senderId; // senderId is the ID of the participant who accepted the call
        const peerConnection = peerConnectionRef.current.get(senderId);

        if (!peerConnection.remoteDescription) {
          console.log('call has been accepted from callee');

          peerConnection.setRemoteDescription(response.callObj.offer);

          dispatch(updateParticipants(response.participants));
        }
      }
    };

    const handleIncomingAnswer = (response) => {
      if (peerConnectionRef.current) {
        console.log('Incoming answer');

        const senderId = response.senderId; // senderId is the ID of the participant who accepted the call
        const peerConnection = peerConnectionRef.current.get(senderId);

        if (!peerConnection.remoteDescription) {
          console.log('call has been accepted');

          peerConnection.setRemoteDescription(response.callObj.answer);

          dispatch(updateParticipants(response.participants));
        }
      }
    };

    const handleIncomingICE = (response) => {
      if (peerConnectionRef.current) {
        const senderId = response.senderId;
        const peerConnection = peerConnectionRef.current.get(senderId);

        const ices = response.iceCandidates;
        console.log(
          'adding ICE candidate from caller after handleIncomingOffer',
          ices,
        );
        ices.forEach((ice) => {
          peerConnection
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
        console.log('Call ended from end event in callee');
        dispatch(endCall());
        cleanup();
      }
    };

    try {
      // Register socketGeneralRef listeners
      socketGeneralRef.current.on('call:incomingCall', handleIncomingCall);
      socketGeneralRef.current.on('call:incomingOffer', handleIncomingOffer);
      socketGeneralRef.current.on('call:incomingAnswer', handleIncomingAnswer);
      socketGeneralRef.current.on('call:addedICE', handleIncomingICE);
      socketGeneralRef.current.on('call:endedCall', handleEndCallFromCaller);
    } catch (error) {
      console.error(error);
    }

    return () => {
      // Cleanup socketGeneralRef listeners
      socketGeneralRef.current.off('call:incomingCall', handleIncomingCall);
      socketGeneralRef.current.off('call:incomingOffer', handleIncomingOffer);
      socketGeneralRef.current.off('call:incomingAnswer', handleIncomingAnswer);
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
