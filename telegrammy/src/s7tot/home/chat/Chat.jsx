import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteButton from './VoiceNoteButton';
import VoiceNotePlayer from './VoiceNotePlayer';
import StickerIcon from '../../icons/StickerIcon';
import GifIcon from '../../icons/GIFIcon';
import styles from './Chat.module.css';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import CryptoJS from 'crypto-js';
import Trie from './Trie';
import {
  initialMessages1,
  initialMessages2,
  initialMessages3,
} from './../../../mocks/mockDataChat';
import { initialChatsLSB } from '../../../mocks/mockDataChatList';
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

const mentionUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];
let trie = new Trie();

function Chat() {
  const isAdmin = false;
  const { openedChat, searchVisible, searchText } = useSelector(
    (state) => state.chats,
  );
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([initialMessages1]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyToMessageId, setReplyToMessageId] = useState(null);
  const [forwardingMessageId, setForwardingMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('emoji'); // Tabs: 'emoji', 'stickers', 'gifs'
  const [gifs, setGifs] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(0); // For navigating suggestions
  const [isMentioning, setIsMentioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const [pinnedMsgs, setPinnedMsgs] = useState([]);
  const secretKey = 'our-secret-key';
  let it = 0;
  let it1 = 0;

 
  const handleNavigateToPinned = () => {
    const msg = messageRefs.current[pinnedMsgs[it1]];
    msg.classList.add("bg-yellow-200");

    msg.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      msg.classList.remove("bg-yellow-200");
    }, 1000);
    it1++;
    if (it1 >= pinnedMsgs.length) it1 = 0;
  };
  const handlePinMessage = (messageId, ispinned) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg,
      ),
    );
    if (!ispinned) {
      setPinnedMsgs([...pinnedMsgs, messageId]);
    } else {
      const newPinnedArr = pinnedMsgs.filter((el) => el != messageId);
      setPinnedMsgs(newPinnedArr);
    }
    console.log(pinnedMsgs);
  };

  const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };

  const decryptMessage = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const [prevChat, setPrevChat] = useState(null);
  useEffect(() => {
    console.log('Opened chat changed:', openedChat.name);
    console.log(openedChat);
    switch (prevChat) {
      case 'user1':
        let i = initialMessages1.length;
        for (; i < messages.length; i++) {
          initialMessages1.push(messages[i]);
        }
        break;
      case 'user2':
        let j = initialMessages2.length;
        for (; j < messages.length; j++) {
          initialMessages2.push(messages[j]);
        }
        break;
      case 'user3':
        let k = initialMessages3.length;
        for (; k < messages.length; k++) {
          initialMessages3.push(messages[k]);
        }
        break;
      default:
        break;
    }
    switch (openedChat.name) {
      case 'user1':
        trie = new Trie();
        initialMessages1.map((mess) => trie.insert(mess.content, mess.id));
        setMessages(initialMessages1);
        break;
      case 'user2':
        trie = new Trie();
        initialMessages2.map((mess) => trie.insert(mess.content, mess.id));
        setMessages(initialMessages2);
        break;
      case 'user3':
        trie = new Trie();
        initialMessages3.map((mess) => trie.insert(mess.content, mess.id));
        setMessages(initialMessages3);
        break;
      default:
        setMessages([]);
    }
    setPrevChat(openedChat.name);
  }, [openedChat]);

  const handleSearch = (text) => {
    const ids = trie.startsWith(text);
    if (ids.length > 0) {
      console.log('yes');
      if (it >= ids.length) it = 0;
      console.log(it);
      const msg = messageRefs.current[ids[it]];
      msg.classList.add("bg-yellow-200");

      msg.scrollIntoView({ behavior: 'smooth' });
  
      setTimeout(() => {
        msg.classList.remove("bg-yellow-200");
      }, 1000);
      it1++;
      if (it1 >= pinnedMsgs.length) it1 = 0;
    }
  };
  useEffect(() => {
    if (searchText) {
      console.log(`Search text changed: ${searchText}`);

      // Example: Scroll to a message or filter messages based on searchText
      handleSearch(searchText);
    }
  }, [searchText]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const mentionMatch = value.match(/@(\w*)$/); // Match `@` followed by optional text
    if (mentionMatch) {
      const mentionQuery = mentionMatch[1];
      const suggestions = mentionUsers.filter((user) =>
        user.toLowerCase().startsWith(mentionQuery.toLowerCase()),
      );
      setFilteredUsers(suggestions);
      setIsMentioning(true);
      setMentionIndex(-1); // Reset dropdown selection
    } else {
      setFilteredUsers([]);
      setIsMentioning(false);
    }
  };

  const handleSelectUser = (user) => {
    // Replace the @mention with the selected user
    const updatedInputValue = inputValue.replace(/@\w*$/, `@${user} `);
    setInputValue(updatedInputValue);
    setIsMentioning(false);
    setFilteredUsers([]);
    setMentionIndex(-1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > 26214400) {
      setErrorMessage('The maximum file size is 25 MB.');
      setSelectedFile(null);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      setErrorMessage('');
      setSelectedFile(file);
    }
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
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === editingMessageId) {
              trie.delete(msg.content, msg.id);
              return { ...msg, ...newMessage };
            }
            return msg;
          }),
        );
        trie.insert(newMessage.content, editingMessageId);
        setEditingMessageId(null);
      } else {
        trie.insert(newMessage.content, messages.length + 1);
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

  const handleForwardMessage = (chat) => {
    const messageToForward = messages.find(
      (msg) => msg.id === forwardingMessageId,
    );
    const length =
      chat.name === 'user1'
        ? initialMessages1.length
        : chat.name === 'user2'
          ? initialMessages2.length
          : initialMessages3.length;
    if (messageToForward) {
      const newMessage = {
        ...messageToForward,
        id: length + 1,
        type: 'sent',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
      };
      switch (chat.name) {
        case 'user1':
          initialMessages1.push(newMessage);
          break;
        case 'user2':
          initialMessages2.push(newMessage);
          break;
        case 'user3':
          initialMessages3.push(newMessage);
          break;
        default:
          break;
      }
      setForwardingMessageId(null);
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
      setPinnedMsgs((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id),
      );
    }
  };

  const handleClickForwardMessage = (id) => {
    setForwardingMessageId(id);
    setInputValue(''); // Clear input if forwarding
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

  const handleKeyDown = (event) => {
    if (isMentioning) {
      if (event.key === 'ArrowDown') {
        // Move selection down
        event.preventDefault();
        setMentionIndex((prevIndex) =>
          prevIndex < filteredUsers.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (event.key === 'ArrowUp') {
        // Move selection up
        event.preventDefault();
        setMentionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredUsers.length - 1,
        );
      } else if (event.key === 'Enter' && mentionIndex >= 0) {
        // Select the current mention
        event.preventDefault();
        handleSelectUser(filteredUsers[mentionIndex]);
      } else if (event.key === 'Escape') {
        // Close the mention dropdown
        setIsMentioning(false);
        setFilteredUsers([]);
      }
    } else {
      if (event.key === 'Enter') handleSendMessage();
    }
  };

  const handleKey = (event) => {
    if (event.key === 'Enter' && searchVisible) {
      it++;
      handleSearch(searchText);
    }
  };
  let lastDate = null;

  return (
    <div
      className={`relative flex flex-grow flex-col justify-between ${viewingImage ? '' : 'space-y-4'} overflow-y-auto text-black dark:text-white`}
    >
      <ChatHeader handleKey={handleKey} />
      {pinnedMsgs.length > 0 && (
        <div className="rounded-lg bg-bg-primary p-2 shadow-md">
          <h2
            data-test-id="navigate-to-pinned-h2"
            className="flex cursor-pointer items-center space-x-2 pl-3 text-lg font-semibold text-white"
            onClick={() => handleNavigateToPinned()}
          >
            <span className="text-base">📌</span>
            <span className="text-sm">Pinned Messages</span>
          </h2>
        </div>
      )}

      <div className="no-scrollbar flex-grow overflow-y-auto px-4">
        {messages.map((message, idx) => {
          const showDateDivider = message.date !== lastDate;
          lastDate = message.date;

          return (
            <React.Fragment key={message.id}>
              <div ref={(el) => (messageRefs.current[message.id] = el)}
                    key={message.id}
                    className= ''>
               
                {showDateDivider && (
                  <div className="my-2 flex justify-center">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700">
                      {formatDate(message.date)}
                    </span>
                  </div>
                )}
                {message.voiceNote ? (
                  <div>
                    <VoiceNotePlayer
                      src={message.voiceNote}
                      time={message.timestamp}
                      type={message.type}
                    />
                  </div>
                ) : message.file ? (
                  <div
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-5 items-center`}
                  >
                    {message.type === 'sent' && (
                      <div className="flex flex-row space-x-2 pr-2">
                        <button
                          data-test-id={`${idx}-file-forward-button`}
                          onClick={() => handleClickForwardMessage(message.id)}
                          className="text-xs text-green-500 hover:underline"
                        >
                          Forward
                        </button>
                        <button
                          data-test-id={`${idx}-file-edit-button`}
                          onClick={() => handleEditMessage(message.id)}
                          className="mr-2 text-xs text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          data-test-id={`${idx}-file-delete-button`}
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                        <button
                          data-test-id={`${idx}-file-pin-unpin-button`}
                          onClick={() =>
                            handlePinMessage(message.id, message.pinned)
                          }
                          className="text-white-500 ml-2 text-xs hover:underline"
                        >
                          {message.pinned ? 'UnPin' : 'Pin'}
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
                          data-test-id={`${idx}-message-image`}
                          src={message.file}
                          alt={message.fileName}
                          className="h-auto max-w-full cursor-pointer rounded-lg"
                          onClick={() => handleImageClick(message.file)}
                        />
                      ) : message.fileType.startsWith('video/') ? (
                        <video
                          controls
                          className="h-auto max-w-full rounded-lg"
                        >
                          <source src={message.file} type={message.fileType} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <a
                          data-test-id={`${idx}-document-link`}
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
                        data-test-id={`${idx}-reply-button`}
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
                      <div className="flex flex-row space-x-2 pr-2">
                        <button
                          data-test-id={`${idx}-message-forward-button`}
                          onClick={() => handleClickForwardMessage(message.id)}
                          className="text-xs text-green-500 hover:underline"
                        >
                          Forward
                        </button>
                        <button
                          data-test-id={`${idx}-message-edit-button`}
                          onClick={() => handleEditMessage(message.id)}
                          className="mr-2 text-xs text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          data-test-id={`${idx}-message-delete-button`}
                          onClick={() => handleDeleteMessage(message.id)}
                          className="mr-2 text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                        <button
                          data-test-id={`${idx}-message-pin-unpin-button`}
                          onClick={() =>
                            handlePinMessage(message.id, message.pinned)
                          }
                          className="text-white-500 ml-2 text-xs hover:underline"
                        >
                          {message.pinned ? 'UnPin' : 'Pin'}
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
                          <span
                            data-test-id={`${idx}-replying-to-span`}
                            className="text-xs text-gray-500"
                          >
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
                      <>
                        <button
                          data-test-id={`${idx}-recieved-forward-button`}
                          onClick={() => handleClickForwardMessage(message.id)}
                          className="ml-2 text-xs text-green-500 hover:underline"
                        >
                          Forward
                        </button>
                        <button
                          data-test-id={`${idx}-recieved-reply-button`}
                          onClick={() => handleReplyToMessage(message.id)}
                          className="ml-2 text-xs text-blue-500 hover:underline"
                        >
                          Reply
                        </button>
                        <button
                          data-test-id={`${idx}-recieved-pin-unpin-button`}
                          onClick={() =>
                            handlePinMessage(message.id, message.pinned)
                          }
                          className="text-white-500 ml-2 text-xs hover:underline"
                        >
                          {message.pinned ? 'UnPin' : 'Pin'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-bg-message-receiver p-4">
        {errorMessage && (
          <div
            data-test-id="error-message"
            className="error-message mb-2 text-red-500"
          >
            {errorMessage}
          </div>
        )}
        {replyToMessageId && (
          <div className="flex flex-row">
            <div className="mb-2 flex-grow rounded-lg border-l-[#d56e78] bg-[#fbf0f1] p-2">
              <span className="text-xs text-gray-600">Replying to: </span>
              <p className="text-sm">
                {messages.find((msg) => msg.id === replyToMessageId)?.content}
              </p>
            </div>
            <button
              data-test-id="cancel-reply-button"
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
            data-test-id="emojis-button"
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
                  data-test-id="emoji-button"
                  onClick={() => setActiveTab('emoji')}
                  className={`flex-grow p-2 ${
                    activeTab === 'emoji' ? 'bg-gray-300 dark:bg-gray-600' : ''
                  }`}
                >
                  {' '}
                  😊
                </button>
                <button
                  data-test-id="sticker-active-tab-button"
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
                  data-test-id="gif-active-tab-button"
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
                      className={styles['custom-picker']}
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
                      data-test-id="stickers-search-input"
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
                            data-test-id={`${index}-sticker-image`}
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
                      data-test-id="gif-search-input"
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
                            data-test-id={`${index}-gif-image`}
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
          {isMentioning && filteredUsers.length > 0 && (
            <div className="absolute bottom-16 left-4 z-50 w-64 rounded-lg bg-white shadow-lg dark:bg-gray-800">
              {filteredUsers.map((user, index) => (
                <div
                  data-test-id={`${index}-to-mention-user`}
                  key={index}
                  className={`cursor-pointer p-2 ${
                    mentionIndex === index ? 'bg-gray-300' : ''
                  }`}
                  onMouseDown={() => handleSelectUser(user)}
                  onMouseEnter={() => setMentionIndex(index)}
                >
                  {user}
                </div>
              ))}
            </div>
          )}
          <input
            data-test-id="message-input"
            disabled={openedChat.type === 'Channel' && !isAdmin}
            type="text"
            placeholder={
              !isAdmin && openedChat.type === 'Channel'
                ? "YOU DON'T HAVE PERMISSION!"
                : editingMessageId
                  ? 'Edit your message...'
                  : replyToMessageId
                    ? 'Type your reply...'
                    : 'Type your message...'
            }
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="relative">
            <button
              data-test-id="toggle-menu-button"
              onClick={toggleMenu}
              className="cursor-pointer"
            >
              📎
            </button>
            {isMenuVisible && (
              <div className="absolute bottom-full mb-2 flex flex-col space-y-1 bg-white p-2 shadow-lg dark:bg-gray-700">
                <button
                  data-test-id="attach-image-button"
                  onClick={() => handleFileTypeSelection('image')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Image
                </button>
                <button
                  data-test-id="attach-video-button"
                  onClick={() => handleFileTypeSelection('video')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Video
                </button>
                <button
                  data-test-id="attach-document-button"
                  onClick={() => handleFileTypeSelection('document')}
                  className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Document
                </button>
              </div>
            )}
          </div>
          <input
            data-test-id="attach-image-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-image"
            accept="image/*"
          />
          <input
            data-test-id="attach-video-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-video"
            accept="video/*"
          />
          <input
            data-test-id="attach-document-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-document"
            accept=".pdf,.doc,.docx,.txt"
          />
          <VoiceNoteButton onSendVoice={handleSendVoice} />
          <button
            data-test-id="send-message-button"
            onClick={handleSendMessage}
            className="hover:bg-bg-message-sender-hover rounded-lg bg-bg-message-sender px-4 py-2 text-white"
          >
            {editingMessageId ? 'Update' : 'Send'}
          </button>
          {editingMessageId && (
            <button
              data-test-id="cancel-edit-message-button"
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
              data-test-id="viewing-image-exit-button"
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
      {forwardingMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center space-y-0 bg-black bg-opacity-40">
          <div className="relative flex flex-row items-center justify-center">
            {/* Center this image */}
            <div className="z-50 w-64 rounded-lg bg-white shadow-lg dark:bg-gray-800">
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Forward to:
                </h3>
                {initialChatsLSB.map((chat) => (
                  <div
                    data-test-id={`${chat.id}-forward-to-div`}
                    key={chat.id}
                    className="flex cursor-pointer flex-row p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      handleForwardMessage(chat);
                    }}
                  >
                    <img
                      src={chat.picture}
                      alt={chat.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="ml-2">{chat.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              data-test-id="forward-menu-exit-button"
              onClick={() => {
                setForwardingMessageId(null);
                setInputValue('');
              }}
              className="m-4 self-start rounded-full bg-black bg-opacity-50 p-2 text-2xl text-white hover:bg-opacity-75"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
