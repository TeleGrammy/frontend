import React from 'react';
import { MessageItem } from './MessageItem';

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString();
};

export const MessagesList = ({
  messages,
  handleEditMessage,
  handleDeleteMessage,
  handleReplyToMessage,
  handlePinMessage,
  handleComment,
  handleShowComments,
  handleImageClick,
  handleClickForwardMessage,
  messagesEndRef,
  messageRefs,
}) => {
  let lastDate = null;
  return (
    <div className="no-scrollbar flex-grow overflow-y-auto px-4">
      {messages.map((message, idx) => {
        const showDateDivider =
          !lastDate ||
          new Date(message.timestamp).toDateString() !==
            new Date(lastDate).toDateString();
        lastDate = getDateFromTimestamp(message.timestamp);
        return (
          <MessageItem
            message={message}
            idx={idx}
            handleImageClick={handleImageClick}
            handleReplyToMessage={handleReplyToMessage}
            handleEditMessage={handleEditMessage}
            handleDeleteMessage={handleDeleteMessage}
            handleClickForwardMessage={handleClickForwardMessage}
            handlePinMessage={handlePinMessage}
            handleComment={handleComment}
            handleShowComments={handleShowComments}
            messageRefs={messageRefs}
            showDateDivider={showDateDivider}
            key={message._id || idx}
            messages={messages}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
