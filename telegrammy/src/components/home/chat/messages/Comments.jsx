import React from 'react';

const formatDate = (date) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const Comments = ({ comments }) => {
  return (
    <div className="no-scrollbar absolute left-1/2 top-1/2 h-[50%] w-[40%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-bg-secondary p-4 text-text-primary">
      <h2 className="mb-4 text-lg font-semibold">Comments</h2>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="mb-4 flex items-start border-b border-gray-700 pb-4 last:border-none"
        >
          {/* Avatar */}
          <img
            src={`https://ui-avatars.com/api/?name=${comment.senderId.username}`}
            alt={`${comment.senderId.username}'s avatar`}
            className="mr-3 h-10 w-10 rounded-full"
          />
          {/* comment Content */}
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                {comment.senderId.screenName}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-200">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
