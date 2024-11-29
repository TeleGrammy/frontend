import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteButton from './VoiceNoteButton';
import VoiceNotePlayer from './VoiceNotePlayer';
import StickerIcon from '../../icons/StickerIcon';
import GifIcon from '../../icons/GIFIcon';
import '../../../../public/css/picker.css';
import axios from 'axios';
import Picker from 'emoji-picker-react';

import ChatHeader from './ChatHeader';
import { useSelector } from 'react-redux';
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
];

function Chat() {
  const isAdmin = false;
  const { openedChat } = useSelector((state) => state.chats);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyToMessageId, setReplyToMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('emoji'); // Tabs: 'emoji', 'stickers', 'gifs'
  const [gifs, setGifs] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Store the selected item

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '' || selectedFile) {
      if (selectedFile) setLoading(true);

      const newMessage = {
        content: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        date: new Date().toISOString().slice(0, 10),
        replyTo: replyToMessageId || null, // Link the reply if there's any
      };

      if (selectedFile) {
        newMessage.file = URL.createObjectURL(selectedFile);
        newMessage.fileName = selectedFile.name;
        newMessage.fileType = selectedFile.type;
        setSelectedFile(null); // Clear the selected file after sending
      }

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
      setLoading(false);
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
      type: 'received',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }),
      date: new Date().toISOString().slice(0, 10),
      voiceNote: URL.createObjectURL(audioBlob),
    };
    setMessages([...messages, newMessage]);
  };

  const handleImageClick = (src) => {
    setViewingImage(src);
  };

  const handleCloseImageView = () => {
    setViewingImage(null);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleFileTypeSelection = (type) => {
    setIsMenuVisible(false);
    document.getElementById(`file-input-${type}`).click();
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };
  const fetchGifs = async (query) => {
    const API_KEY = 'qU4yFyriCMVi6jpjzbUkcFH8CExbUGHK';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=5&offset=0&rating=g&lang=en`; // Giphy API endpoint for searching Stickers
    try {
      const response = await axios.get(url);
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const fetchStickers = async (query) => {
    const API_KEY = 'qU4yFyriCMVi6jpjzbUkcFH8CExbUGHK';
    const url = `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${query}&limit=5`; // Giphy API endpoint for searching Stickers
    try {
      const response = await axios.get(url);
      setStickers(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching Stickers:', error);
    }
  };

  const handleSelectItem = (item) => {
    console.log(item);
    const newMessage = {
      id: messages.length + 1,
      type: 'sent',
      content: (
        <img
          key={messages.length + 1}
          src={item} // Adjust according to the response structure
          alt="Sticker"
          width="100"
        />
      ),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }),
      date: new Date().toISOString().slice(0, 10),
      replyTo: replyToMessageId || null,
    };

    setMessages([...messages, newMessage]);
  };

  let lastDate = null;

  return (
    <div
      className={`relative flex flex-grow flex-col justify-between ${viewingImage ? '' : 'space-y-4'} overflow-y-auto text-black dark:text-white`}
    >
      <ChatHeader />
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
              ) : message.file ? (
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
                    {message.fileType.startsWith('image/') ? (
                      <img
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
                        href={message.file}
                        download={message.fileName}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                      >
                        {message.fileName}
                      </a>
                    )}
                    {message.content && (
                      <p className="mt-2">{message.content}</p>
                    )}
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
              ) : (
                <div
                  className={`flex ${
                    message.type === 'sent' ? 'justify-end' : 'justify-start'
                  } mb-5 items-center`}
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
          {/* Emoji/Sticker/GIF Picker Button */}
          <button
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            😊
          </button>
          {isPickerOpen && (
            <div className="absolute bottom-16 left-4 z-50 w-64 rounded-lg bg-gray-100 shadow-lg dark:bg-gray-800">
              {/* Tab Navigation */}
              <div className="flex justify-around border-b border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setActiveTab('emoji')}
                  className={`flex-grow p-2 ${
                    activeTab === 'emoji' ? 'bg-gray-300 dark:bg-gray-600' : ''
                  }`}
                >
                  {' '}
                  😊
                </button>
                <button
                  onClick={() => setActiveTab('stickers')}
                  className={`flex-grow p-2 ${
                    activeTab === 'stickers'
                      ? 'bg-gray-300 dark:bg-gray-600'
                      : ''
                  }`}
                >
                  <StickerIcon />
                </button>
                <button
                  onClick={() => setActiveTab('gifs')}
                  className={`flex-grow p-2 ${
                    activeTab === 'gifs' ? 'bg-gray-300 dark:bg-gray-600' : ''
                  }`}
                >
                  {' '}
                  <GifIcon />
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === 'emoji' && (
                  <div className="flex flex-wrap gap-2">
                    <Picker
                      set="google" // Use Google's emoji set
                      showPreview={false} // Disable the preview
                      className="custom-picker"
                      style={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                      }}
                      onEmojiClick={(emoji) => {
                        handleEmojiClick(emoji);
                      }}
                    />
                  </div>
                )}
                {activeTab === 'stickers' && (
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      className="rounded p-0.5 pl-3 text-gray-600"
                      placeholder="Search"
                      onChange={(e) => {
                        const query = e.target.value;
                        fetchStickers(query);
                      }}
                    />
                    <div>
                      {/* Ensure stickers is always an array */}
                      {stickers && stickers.length > 0 ? (
                        stickers.map((sticker, index) => (
                          <img
                            key={index}
                            src={sticker.images.fixed_height.url} // Adjust according to the response structure
                            alt="Sticker"
                            width="100"
                            onClick={() =>
                              handleSelectItem(sticker.images.fixed_height.url)
                            }
                            className="cursor-pointer"
                          />
                        ))
                      ) : (
                        <p>No stickers found</p> // Fallback if no stickers are found
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'gifs' && (
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      className="rounded p-0.5 pl-3 text-gray-600"
                      placeholder="Search"
                      onChange={(e) => {
                        const query = e.target.value;
                        fetchGifs(query);
                      }}
                    />
                    <div>
                      {/* Ensure stickers is always an array */}
                      {gifs && gifs.length > 0 ? (
                        gifs.map((gif, index) => (
                          <img
                            key={index}
                            src={gif.images.fixed_height.url} // Adjust according to the response structure
                            alt="gif"
                            width="100"
                            onClick={() =>
                              handleSelectItem(gif.images.fixed_height.url)
                            } // Capture selected sticker
                            className="cursor-pointer"
                          />
                        ))
                      ) : (
                        <p>No GIFs found</p> // Fallback if no stickers are found
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <input
            disabled={openedChat.type === 'Channel' && !isAdmin}
            type="text"
            placeholder={
              !isAdmin
                ? "YOU DON'T HAVE PERMISSION!"
                : editingMessageId
                  ? 'Edit your message...'
                  : replyToMessageId
                    ? 'Type your reply...'
                    : 'Type your message...'
            }
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="relative">
            <button onClick={toggleMenu} className="cursor-pointer">
              📎
            </button>
            {isMenuVisible && (
              <div className="absolute bottom-full mb-2 flex flex-col space-y-1 bg-white p-2 shadow-lg dark:bg-gray-700">
                <button
                  onClick={() => handleFileTypeSelection('image')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Image
                </button>
                <button
                  onClick={() => handleFileTypeSelection('video')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Video
                </button>
                <button
                  onClick={() => handleFileTypeSelection('document')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Document
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-image"
            accept="image/*"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-video"
            accept="video/*"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-document"
            accept=".pdf,.doc,.docx,.txt"
          />
          <VoiceNoteButton onSendVoice={handleSendVoice} />
          <button
            onClick={handleSendMessage}
            className="rounded-lg bg-bg-button px-4 py-2 text-text-primary hover:bg-bg-button-hover"
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
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center space-y-0 bg-black bg-opacity-75">
          <div className="relative flex flex-row items-center justify-center">
            {/* Center this image */}
            <img
              src={viewingImage}
              alt="Viewing"
              className="h-[50%] w-[50%] cursor-pointer object-contain"
            />
            <button
              onClick={handleCloseImageView}
              className="m-4 self-start rounded-full bg-black bg-opacity-50 p-2 text-2xl text-white hover:bg-opacity-75"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-transparent"></div>
            <span className="text-white">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
