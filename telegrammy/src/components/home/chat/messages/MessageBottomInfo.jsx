import React from 'react';
const formatDate = (date) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleTimeString('en-US', options);
};

const MessageBottomInfo = ({ message }) => {
  return (
    <div className="mt-1 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
      <span>{formatDate(message.timestamp)}</span>
      {message.type === 'sent' && <span className="ml-1">✔✔</span>}
    </div>
  );
};

export default MessageBottomInfo;
