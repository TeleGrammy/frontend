import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  acceptCall,
  declineCall,
  endCall,
  updateTime,
  setIntervalId,
} from '../../../slices/callSlice';

function CallButtons() {
  const { callState } = useSelector((state) => state.call);
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptCall());
  };

  const handleDecline = () => {
    dispatch(declineCall());
  };

  const handleEndCall = () => {
    dispatch(endCall());
  };

  // if (callState === 'ringing') {
  return (
    <div className="mt-4 flex justify-around">
      {callState === 'incoming call' ? (
        <>
          {/* Decline and Accept Buttons */}
          <button
            onClick={handleDecline}
            className="rounded-lg bg-red-500 px-6 py-2 text-white shadow transition hover:bg-red-600"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-green-500 px-6 py-2 text-white shadow transition hover:bg-green-600"
          >
            Accept
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleEndCall}
            className="rounded-lg bg-red-500 px-6 py-2 text-white shadow transition hover:bg-red-600"
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
}

export default CallButtons;
