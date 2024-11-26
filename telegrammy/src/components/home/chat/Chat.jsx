import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteButton from './VoiceNoteButton';
import VoiceNotePlayer from './VoiceNotePlayer';

function formatDate(date) {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

const initialMessages = [
  {
    id: 1,
    content: 'Hello',
    type: 'sent',
    timestamp: '12:00 AM',
    date: '2024-11-10',
  },
  {
    id: 2,
    content: 'Hi',
    type: 'received',
    timestamp: '12:01 AM',
    date: '2024-11-10',
  },
  {
    id: 3,
    content: 'Do you love me',
    type: 'received',
    timestamp: '12:02 AM',
    date: '2024-11-10',
  },
  {
    id: 4,
    content: 'Do you Do you do',
    type: 'received',
    timestamp: '12:03 AM',
    date: '2024-11-11',
  },
  {
    id: 5,
    content: 'No',
    type: 'sent',
    timestamp: '12:04 AM',
    date: '2024-11-11',
  },
];

function Chat() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyToMessageId, setReplyToMessageId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      const newMessage = {
        content: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        date: new Date().toISOString().slice(0, 10),
        replyTo: replyToMessageId || null, // Link the reply if there's any
      };

      if (editingMessageId) {
        // Edit the existing message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editingMessageId ? { ...msg, ...newMessage } : msg,
          ),
        );
        // Reset after editing
        setEditingMessageId(null);
      } else {
        // Add a new message
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            ...newMessage,
            type: 'sent',
          },
        ]);
      }

      // Clear input and reset reply state after sending
      setInputValue('');
      setReplyToMessageId(null);
    }
  };

  const handleEditMessage = (id) => {
    const messageToEdit = messages.find((msg) => msg.id === id);
    if (messageToEdit) {
      setInputValue(messageToEdit.content);
      setEditingMessageId(id);
    }
  };

  const handleDeleteMessage = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this message?',
    );
    if (confirmDelete) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id),
      );
    }
  };

  const handleReplyToMessage = (id) => {
    setReplyToMessageId(id);
    setInputValue(''); // Clear input if replying
  };

  const handleSendVoice = (audioBlob) => {
    const newMessage = {
      id: messages.length + 1,
      content: 'Voice Note Sent',
      type: 'recieved',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }),
      date: new Date().toISOString().slice(0, 10),
      voiceNote: URL.createObjectURL(audioBlob),
    };
    setMessages([...messages, newMessage]);
  };

  let lastDate = null;

  return (
    <div className="relative flex flex-grow flex-col justify-between space-y-4 overflow-y-auto text-black dark:text-white">
      <div className="flex-grow overflow-y-auto px-4">
        {messages.map((message) => {
          const showDateDivider = message.date !== lastDate;
          lastDate = message.date;

          return (
            <React.Fragment key={message.id}>
              {showDateDivider && (
                <div className="my-2 flex justify-center">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700">
                    {formatDate(message.date)}
                  </span>
                </div>
              )}
              {message.voiceNote ? (
                <VoiceNotePlayer
                  src={message.voiceNote}
                  time={message.timestamp}
                  type={message.type}
                />
              ) : (
                <div
                  className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-5 items-center`}
                >
                  {message.type === 'sent' && (
                    <div className="flex flex-row space-x-1 pr-2">
                      <button
                        onClick={() => handleEditMessage(message.id)}
                        className="mr-2 text-xs text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div
                    className={`${
                      message.type === 'sent'
                        ? 'bg-bg-message-sender'
                        : 'bg-bg-message-receiver'
                    } max-w-sm rounded-lg p-2 text-text-primary`}
                  >
                    {message.replyTo && (
                      <div className="mb-2 border-l-4 border-blue-500 p-2">
                        <span className="text-xs text-gray-500">
                          Replying to:
                        </span>
                        <p className="text-sm">
                          {
                            messages.find((msg) => msg.id === message.replyTo)
                              ?.content
                          }
                        </p>
                      </div>
                    )}
                    <p>{message.content}</p>
                    <div className="mt-1 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
                      <span>{message.timestamp}</span>
                      {message.type === 'sent' && (
                        <span className="ml-1">✔✔</span>
                      )}
                    </div>
                  </div>
                  {message.type === 'received' && (
                    <button
                      onClick={() => handleReplyToMessage(message.id)}
                      className="ml-2 text-xs text-blue-500 hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-bg-message-receiver p-4">
        {replyToMessageId && (
          <div className="flex flex-row">
            <div className="mb-2 flex-grow rounded-lg border-l-[#d56e78] bg-[#fbf0f1] p-2">
              <span className="text-xs text-gray-600">Replying to: </span>
              <p className="text-sm">
                {messages.find((msg) => msg.id === replyToMessageId)?.content}
              </p>
            </div>
            <button
              className="p-2 text-text-primary"
              onClick={() => setReplyToMessageId(null)}
            >
              X
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={
              editingMessageId
                ? 'Edit your message...'
                : replyToMessageId
                  ? 'Type your reply...'
                  : 'Type your message...'
            }
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <VoiceNoteButton onSendVoice={handleSendVoice} />
          <button
            onClick={handleSendMessage}
            className="hover:bg-bg-message-sender-hover rounded-lg bg-bg-message-sender px-4 py-2 text-white"
          >
            {editingMessageId ? 'Update' : 'Send'}
          </button>
          {editingMessageId && (
            <button
              onClick={() => {
                setEditingMessageId(null);
                setInputValue('');
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
