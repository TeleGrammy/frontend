import React from 'react';

const ReplyingInfo = ({ message, messages, idx }) => {
  const repliedMessage = messages?.find((msg) => msg.id === message.replyTo);

  return (
    <div className="mb-2 border-l-4 border-blue-500 p-2">
      <span
        data-test-id={`${idx}-replying-to-span`}
        className="text-xs text-gray-500"
      >
        Replying to:
      </span>
      <p className="text-sm">
        {repliedMessage?.content || 'Message not found'}
      </p>
    </div>
  );
};

export default ReplyingInfo;
