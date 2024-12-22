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

export const DateDivider = ({ message }) => {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700">
        {formatDate(message.timestamp)}
      </span>
    </div>
  );
};
