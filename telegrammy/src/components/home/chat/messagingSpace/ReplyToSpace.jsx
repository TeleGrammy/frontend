import React from 'react';

const ReplyToSpace = ({ messages, replyToMessageId, setReplyToMessageId }) => {
  return (
    <div className="flex flex-row">
      <div className="mb-2 flex-grow rounded-lg border-l-[#d56e78] bg-[#fbf0f1] p-2">
        <span className="text-xs text-gray-600">Replying to: </span>
        <p className="text-sm">
          {messages.find((msg) => msg.id === replyToMessageId)?.content}
        </p>
      </div>
      <button
        data-test-id="cancel-reply-button"
        className="p-2 text-text-primary"
        onClick={() => setReplyToMessageId(null)}
      >
        X
      </button>
    </div>
  );
};

export default ReplyToSpace;
