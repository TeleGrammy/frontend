import React from 'react';
import { DateDivider } from './DateDivider';
import VoiceNotePlayer from '../VoiceNotePlayer';
import ReplyingInfo from './ReplyingInfo';
import MessageBottomInfo from './MessageBottomInfo';
import MediaContent from './MediaContent';
import MessageContainer from './MessageContainer';

export const MessageItem = ({
  message,
  handleEditMessage,
  handleDeleteMessage,
  handleReplyToMessage,
  handlePinMessage,
  handleImageClick,
  handleClickForwardMessage,
  messages,
  idx,
  messageRefs,
  showDateDivider,
}) => {
  return (
    <React.Fragment key={message.id}>
      <div
        ref={(el) => (messageRefs.current[message.id] = el)}
        key={message.id}
        className=""
      >
        {showDateDivider && <DateDivider message={message} />}
        {message.voiceNote ? (
          <VoiceNotePlayer
            src={message.voiceNote}
            time={message.timestamp}
            type={message.type}
          />
        ) : (
          // Plain message
          <div
            className={`flex ${
              message.type === 'sent' ? 'justify-end' : 'justify-start'
            } mb-5 items-center`}
          >
            {message.type === 'sent' && (
              <div className="flex flex-row space-x-2 pr-2">
                {/* Forward button */}
                <button
                  data-test-id={`${idx}-message-forward-button`}
                  onClick={() => handleClickForwardMessage(message.id)}
                  className="text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Edit button */}
                <button
                  data-test-id={`${idx}-message-edit-button`}
                  onClick={() => handleEditMessage(message.id)}
                  className="mr-2 text-xs text-blue-500 hover:underline"
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  data-test-id={`${idx}-message-delete-button`}
                  onClick={() => handleDeleteMessage(message.id)}
                  className="mr-2 text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-message-pin-unpin-button`}
                  onClick={() => handlePinMessage(message.id, message.pinned)}
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.pinned ? 'UnPin' : 'Pin'}
                </button>
              </div>
            )}
            <MessageContainer
              message={message}
              messages={messages}
              idx={idx}
              handleImageClick={handleImageClick}
            />
            {message.type === 'received' && (
              <div className="flex flex-row space-x-2 pr-2">
                {/* Forward button */}
                <button
                  data-test-id={`${idx}-recieved-forward-button`}
                  onClick={() => handleClickForwardMessage(message.id)}
                  className="ml-2 text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Reply button */}
                <button
                  data-test-id={`${idx}-recieved-reply-button`}
                  onClick={() => handleReplyToMessage(message.id)}
                  className="ml-2 text-xs text-blue-500 hover:underline"
                >
                  Reply
                </button>
                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-recieved-pin-unpin-button`}
                  onClick={() => handlePinMessage(message.id, message.pinned)}
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.pinned ? 'UnPin' : 'Pin'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
