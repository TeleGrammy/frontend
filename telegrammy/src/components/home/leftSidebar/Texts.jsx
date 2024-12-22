import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

const apiUrl = import.meta.env.VITE_API_URL;

const Texts = ({ searchQuery, selectedCategory }) => {
  const [messages, setMessages] = useState([]); // Store the messages
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const mediaType =
    selectedCategory === 'Text'
      ? 'text'
      : selectedCategory === 'Images'
        ? 'image'
        : selectedCategory === 'Videos'
          ? 'video'
          : selectedCategory === 'Links'
            ? 'link'
            : null;
  // Fetch messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/v1/search/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            mediaType: mediaType,
            searchText: searchQuery,
          }),
        });
        const data = await response.json();
        console.log(data);
        const filteredMessages = data?.data?.message;
        setMessages(filteredMessages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages');
        console.error(err.message);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [searchQuery, selectedCategory]);

  if (loading)
    return (
      <div className="m-auto h-20">
        <BeatLoader color="gray" size={15} margin={10} />
      </div>
    );
  if (error)
    return <div className="m-auto text-center text-white">{error}</div>;

  return (
    <div className="ViewedChats-container flex h-full w-full flex-col overflow-y-auto bg-bg-primary text-white">
      {/* Messages List */}
      <div className="divide-y divide-gray-700">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="flex w-full cursor-pointer items-center p-4 transition hover:bg-gray-700"
            >
              {/* Sender Profile Picture (Fallback to Initials if not available) */}
              <img
                src={'https://ui-avatars.com/api/?name=' + msg.sender.username}
                alt={`${msg.sender.username}'s avatar`}
                className="h-12 w-12 rounded-full object-cover"
                data-test-id={`chat-avatar-${msg.sender.username}`}
              />

              {/* Message Details */}
              <div className="ml-4 flex-1">
                <p className="font-medium">{msg.sender.username}</p>
                <p className="text-sm text-gray-400">{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="m-auto text-center">No messages found.</div>
        )}
      </div>
    </div>
  );
};

export default Texts;
