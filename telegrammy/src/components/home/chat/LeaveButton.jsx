import React from 'react';

const LeaveButton = ({ handleLeave }) => {
  return (
    <button
      onClick={handleLeave}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      title="Leave Channel"
    >
      🚪
    </button>
  );
};

export default LeaveButton;
