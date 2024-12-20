import React from 'react';

const getMimeType = (url) => {
  const extension = url.split('.').pop();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    default:
      return 'video/mp4'; // Default to mp4 if the extension is unknown
  }
};

const MediaContent = ({ message, handleImageClick, idx }) => {
  const mimeType =
    message.messageType === 'document' ? '' : getMimeType(message.mediaUrl);
  return (
    <>
      {message.messageType === 'image' ? (
        <img
          data-test-id={`${idx}-message-image`}
          src={message.mediaUrl}
          alt={message.mediaKey}
          className="h-auto max-w-full cursor-pointer rounded-lg"
          onClick={() => handleImageClick(message.mediaUrl)}
        />
      ) : message.messageType === 'video' ? (
        <video controls className="h-auto max-w-full rounded-lg">
          <source src={message.mediaUrl} type={mimeType} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <a
          data-test-id={`${idx}-document-link`}
          href={message.mediaUrl}
          download={message.mediaKey.split('/').pop()}
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          {message.mediaKey.split('/').pop()}
        </a>
      )}
    </>
  );
};

export default MediaContent;
