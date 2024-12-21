import React from 'react';
import { DateDivider } from './DateDivider';
import VoiceNotePlayer from '../VoiceNotePlayer';
import ReplyingInfo from './ReplyingInfo';
import MessageBottomInfo from './MessageBottomInfo';
import MediaContent from './MediaContent';
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';
import { FaReply } from 'react-icons/fa';

export const MessageItem = ({
  message,
  handleEditMessage,
  handleDeleteMessage,
  handleReplyToMessage,
  handlePinMessage,
  handleComment,
  handleShowComments,
  handleImageClick,
  handleClickForwardMessage,
  messages,
  idx,
  messageRefs,
  showDateDivider,
}) => {
  const { openedChat } = useSelector((state) => state.chats);
  return (
    <React.Fragment key={message._id}>
      <div
        ref={(el) => (messageRefs.current[message._id] = el)}
        key={message._id}
        className="relative"
      >
        {showDateDivider && <DateDivider message={message} />}
        {message.messageType === 'audio' ? (
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
                  onClick={() => handleClickForwardMessage(message._id)}
                  className="text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Edit button */}
                <button
                  data-test-id={`${idx}-message-edit-button`}
                  onClick={() => handleEditMessage(message)}
                  className="mr-2 text-xs text-blue-500 hover:underline"
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  data-test-id={`${idx}-message-delete-button`}
                  onClick={() => handleDeleteMessage(message)}
                  className="mr-2 text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-message-pin-unpin-button`}
                  onClick={() => {
                    console.log('should pinning ', message);
                    handlePinMessage(message._id, message.isPinned);
                  }}
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.isPinned ? 'UnPin' : 'Pin'}
                </button>
                {/* comment button */}
                {openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-message-comment-button`}
                    onClick={() => handleComment(message._id)}
                    className="mr-2 text-xs text-yellow-600 hover:underline"
                  >
                    Comment
                  </button>
                )}
              </div>
            )}
            <VoiceNotePlayer message={message} messages={messages} idx={idx} />
            {message.type === 'received' && (
              <div className="flex flex-row space-x-2 pr-2">
                {/* Forward button */}
                <button
                  data-test-id={`${idx}-recieved-forward-button`}
                  onClick={() => handleClickForwardMessage(message._id)}
                  className="ml-2 text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Reply button */}
                {!openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-recieved-reply-button`}
                    onClick={() => handleReplyToMessage(message._id)}
                    className="ml-2 text-xs text-blue-500 hover:underline"
                  >
                    Reply
                  </button>
                )}

                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-recieved-pin-unpin-button`}
                  onClick={() =>
                    handlePinMessage(message._id, message.isPinned)
                  }
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.isPinned ? 'UnPin' : 'Pin'}
                </button>
                {/* comment button */}
                {openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-message-comment-button`}
                    onClick={() => handleComment(message._id)}
                    className="mr-2 text-xs text-yellow-600 hover:underline"
                  >
                    Comment
                  </button>
                )}
              </div>
            )}
          </div>
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
                  onClick={() => handleClickForwardMessage(message._id)}
                  className="text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Edit button */}
                <button
                  data-test-id={`${idx}-message-edit-button`}
                  onClick={() => handleEditMessage(message)}
                  className="mr-2 text-xs text-blue-500 hover:underline"
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  data-test-id={`${idx}-message-delete-button`}
                  onClick={() => handleDeleteMessage(message)}
                  className="mr-2 text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-message-pin-unpin-button`}
                  onClick={() => {
                    console.log('should pinning ', message);
                    handlePinMessage(message._id, message.isPinned);
                  }}
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.isPinned ? 'UnPin' : 'Pin'}
                </button>
                {/* comment button */}
                {openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-message-comment-button`}
                    onClick={() => handleComment(message._id)}
                    className="mr-2 text-xs text-yellow-600 hover:underline"
                  >
                    Comment
                  </button>
                )}
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
                  onClick={() => handleClickForwardMessage(message._id)}
                  className="ml-2 text-xs text-green-500 hover:underline"
                >
                  Forward
                </button>
                {/* Reply button */}
                {!openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-recieved-reply-button`}
                    onClick={() => handleReplyToMessage(message._id)}
                    className="ml-2 text-xs text-blue-500 hover:underline"
                  >
                    Reply
                  </button>
                )}
                {/* Pin/Unpin button */}
                <button
                  data-test-id={`${idx}-recieved-pin-unpin-button`}
                  onClick={() =>
                    handlePinMessage(message._id, message.isPinned)
                  }
                  className="text-white-500 ml-2 text-xs hover:underline"
                >
                  {message.isPinned ? 'UnPin' : 'Pin'}
                </button>
                {openedChat.isChannel && (
                  <button
                    data-test-id={`${idx}-message-comment-button`}
                    onClick={() => handleComment(message._id)}
                    className="mr-2 text-xs text-yellow-600 hover:underline"
                  >
                    Comment
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {message.commentsCount > 0 && (
          <div
            onClick={() => handleShowComments(message._id)}
            className="absolute bottom-[-16px] left-14 flex cursor-pointer flex-row gap-4 rounded-lg bg-bg-secondary px-2 py-1 text-xs"
          >
            <FaReply />
            <span>{message.commentsCount} comments</span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
