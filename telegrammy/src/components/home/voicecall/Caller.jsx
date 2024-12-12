import React from 'react';

import { IoMdCall } from 'react-icons/io';
import { useSelector } from 'react-redux';

function Caller() {
  const { callState } = useSelector((state) => state.call);

  const handleCall = () => {
    if (callState !== 'no call') return;
    dispatch(
      startCall({
        caller: JSON.parse(localStorage.getItem('user')),
        chatId: openedChat.id,
      }),
    );
  };

  return (
    <>
      <IoMdCall
        size={24}
        onClick={handleCall}
        className="cursor-pointer text-gray-600 hover:text-gray-900"
      />
    </>
  );
}

export default Caller;
