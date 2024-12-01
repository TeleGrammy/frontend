import React from 'react';

const MediaContent = ({ message, handleImageClick, idx }) => {
  return (
    <>
      {message.fileType.startsWith('image/') ? (
        <img
          data-test-id={`${idx}-message-image`}
          src={message.file}
          alt={message.fileName}
          className="h-auto max-w-full cursor-pointer rounded-lg"
          onClick={() => handleImageClick(message.file)}
        />
      ) : message.fileType.startsWith('video/') ? (
        <video controls className="h-auto max-w-full rounded-lg">
          <source src={message.file} type={message.fileType} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <a
          data-test-id={`${idx}-document-link`}
          href={message.file}
          download={message.fileName}
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          {message.fileName}
        </a>
      )}
    </>
  );
};

export default MediaContent;
