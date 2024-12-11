import React from 'react';

const PinnedMessagesBar = ({ pinnedMsgs, messageRefs, it1, setIt1 }) => {
  const handleNavigateToPinned = () => {
    console.log(pinnedMsgs);

    const msgId = pinnedMsgs[it1];
    const msg = messageRefs.current[msgId];

    if (msg) {
      msg.classList.add('bg-yellow-200');
      msg.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        msg.classList.remove('bg-yellow-200');
      }, 1000);
    } else {
      console.error('Message reference not found for pinned message:', msgId);
    }

    const nextIt1 = it1 + 1 >= pinnedMsgs.length ? 0 : it1 + 1;
    setIt1(nextIt1);
  };
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
