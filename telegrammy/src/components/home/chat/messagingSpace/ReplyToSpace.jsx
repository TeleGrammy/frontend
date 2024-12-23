import React from 'react';

const ReplyToSpace = ({ messages, replyToMessageId, setReplyToMessageId }) => {
  return (
    <div className="flex flex-row">
      <div className="mb-2 flex-grow rounded-lg border-l-[#d56e78] bg-[rgb(46,23,21)] p-2 font-extrabold">
        <span className="text-xs text-gray-600">Replying to: </span>
        <p className="text-sm text-text-secondary">
          {messages.find((msg) => msg._id === replyToMessageId)?.content}
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
