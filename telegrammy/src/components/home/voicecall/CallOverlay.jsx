import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useSocket } from '../../../contexts/SocketContext';

import {
  closeOverlay,
  openOverlay,
  acceptCall,
  declineCall,
  endCall,
} from '../../../slices/callSlice';

import CallButtons from './CallButtons';
import { IoClose } from 'react-icons/io5';

const CallOverlay = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const { callState, callTime, isCallOverlayOpen, chatId } = useSelector(
    (state) => state.call,
  );

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

  const handleAccept = () => {
    dispatch(acceptCall());
  };

  const handleDecline = () => {
    dispatch(declineCall());
  };

  const handleEndCall = () => {
    dispatch(endCall());
  };

  const handleCloseOverlay = () => {
    if (callState === 'callDeclined') {
      dispatch(endCall());
    }
    dispatch(closeOverlay());
  };

  // listen for sockets events
  useEffect(() => {}, [socket]);

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
          />
        )}
      </div>
    </div>
  );
};

export default CallOverlay;
