import React from 'react';

const CommentToSpace = ({
  messages,
  commentToMessageId,
  setCommentToMessageId,
}) => {
  return (
    <div className="flex flex-row">
      <div className="mb-2 flex-grow rounded-lg border-l-[#d56e78] bg-yellow-600 p-2 font-extrabold">
        <span className="text-xs text-gray-600">Commenting to: </span>
        <p className="text-sm text-text-secondary">
          {messages.find((msg) => msg._id === commentToMessageId)?.content}
        </p>
      </div>
      <button
        data-test-id="cancel-reply-button"
        className="p-2 text-text-primary"
        onClick={() => setCommentToMessageId(null)}
      >
        X
      </button>
    </div>
  );
};

export default CommentToSpace;
