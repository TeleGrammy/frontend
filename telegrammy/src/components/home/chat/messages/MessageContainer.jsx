import React from 'react';
import MessageBottomInfo from './MessageBottomInfo';
import MediaContent from './MediaContent';

const MessageContainer = ({ message, messages, idx, handleImageClick }) => {
  return (
    <div
      className={`${
        message.type === 'sent'
          ? 'bg-bg-message-sender'
          : 'bg-bg-message-receiver'
      } max-w-sm rounded-lg p-2 text-text-primary`}
    >
      {message.replyTo && (
        <ReplyingInfo message={message} messages={messages} idx={idx} />
      )}
      {/*Media Content*/}
      {(message.messageType === 'video' || message.messageType === 'image') && (
        <MediaContent
          message={message}
          handleImageClick={handleImageClick}
          idx={idx}
        />
      )}
      {/*Message content*/}
      {message.content && (
        <p className={`${message.file ? 'mt-2' : ''}`}>{message.content}</p>
      )}
      <MessageBottomInfo message={message} />
    </div>
  );
};

export default MessageContainer;
