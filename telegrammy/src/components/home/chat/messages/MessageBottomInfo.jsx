import React from 'react';

const MessageBottomInfo = ({ message }) => {
  return (
    <div className="mt-1 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
      <span>{message.timestamp}</span>
      {message.type === 'sent' && <span className="ml-1">✔✔</span>}
    </div>
  );
};

export default MessageBottomInfo;
