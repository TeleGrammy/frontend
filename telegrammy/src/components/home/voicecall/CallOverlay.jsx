import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CallButtons from './CallButtons';

import { closeOverlay, openOverlay } from '../../../slices/callSlice';

import { IoClose } from 'react-icons/io5';

const CallOverlay = () => {
  const { callState, callTime, participants, isCallOverlayOpen } = useSelector(
    (state) => state.call,
  );

  if (callState === 'no call') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative flex h-[50%] w-[40%] flex-col justify-around rounded-lg bg-bg-secondary p-10 text-center shadow-lg">
        {/* Close Button */}
        <button
          data-test-id="close-call-overlay-button"
          className="absolute right-4 top-4 text-text-primary"
        >
          <IoClose size={24} />
        </button>
        <img
          src={participants[1]?.image || 'https://via.placeholder.com/100'}
          alt="Participant"
          className="mx-auto mb-4 h-24 w-24 rounded-full"
        />
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {callState === 'in call' ? `In Call: ${callTime}` : callState}
        </h2>
        <CallButtons />
      </div>
    </div>
  );
};

export default CallOverlay;
