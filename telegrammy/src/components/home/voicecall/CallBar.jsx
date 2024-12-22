import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { openOverlay } from '../../../slices/callSlice';

function CallBar() {
  const dispatch = useDispatch();

  const { callTime, callState } = useSelector((state) => state.call);

  const handleOpenOverlay = () => {
    dispatch(openOverlay());
  };

  return (
    <div
      onClick={handleOpenOverlay}
      className="absolute left-0 top-0 z-[90] flex h-[1.05rem] w-screen cursor-pointer flex-row items-center justify-center bg-red-800 text-sm"
    >
      {callState === 'in call' ? `In Call: ${callTime}` : callState}
    </div>
  );
}

export default CallBar;
