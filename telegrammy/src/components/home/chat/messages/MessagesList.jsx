import React from 'react';
import { MessageItem } from './MessageItem';

export const MessagesList = ({
  messages,
  handleEditMessage,
  handleDeleteMessage,
  handleReplyToMessage,
  handlePinMessage,
  handleImageClick,
  handleClickForwardMessage,
  messagesEndRef,
  messageRefs,
}) => {
  let lastDate = null;
  return (
    <div className="no-scrollbar flex-grow overflow-y-auto px-4">
      {messages.map((message, idx) => {
        const showDateDivider = message.date !== lastDate;
        lastDate = message.date;
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
            messageRefs={messageRefs}
            showDateDivider={showDateDivider}
            key={message.id}
            messages={messages}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
