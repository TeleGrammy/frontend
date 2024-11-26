import React, { useState } from 'react';

// Helper function to format dates
function formatDate(date) {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

function Chat() {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        content: inputValue,
        type: 'sent',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        date: new Date().toISOString().slice(0, 10),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };
  const messages = [
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

  let lastDate = null;

  return (
    <div className="relative flex flex-grow flex-col space-y-4 overflow-y-auto p-4 text-black dark:text-white">
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
            <div
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col items-end space-y-1">
                <div
                  className={`${
                    message.type === 'sent'
                      ? 'bg-bg-message-sender text-text-primary'
                      : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
                  } max-w-sm rounded-lg p-2`}
                >
                  <p>{message.content}</p>
                  <div className="mt-1 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
                    <span>{message.timestamp}</span>
                    {message.type === 'sent' && (
                      <span className="ml-1">
                        {/* Unicode for double ticks */}
                        ✔✔
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <input
          data-test-id="message"
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            data-test-id = "send-message"
            onClick={handleSendMessage}
            className="bg-bg-message-sender hover:bg-bg-message-sender-hover rounded-lg px-4 py-2 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
