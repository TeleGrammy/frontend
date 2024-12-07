import React from 'react';

const PinnedMessagesBar = (handleNavigateToPinned) => {
  return (
    <div className="rounded-lg bg-bg-primary p-2 shadow-md">
      <h2
        data-test-id="navigate-to-pinned-h2"
        className="flex cursor-pointer items-center space-x-2 pl-3 text-lg font-semibold text-white"
        onClick={handleNavigateToPinned}
      >
        <span className="text-base">📌</span>
        <span className="text-sm">Pinned Messages</span>
      </h2>
    </div>
  );
};

export default PinnedMessagesBar;
