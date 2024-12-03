import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteButton from './VoiceNoteButton';

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
import { MessagesList } from './messages/MessagesList';
import AttachMedia from './messagingSpace/attachment/AttachMedia';
import ViewedImage from './messages/ViewedImage';
import { ClipLoader } from 'react-spinners';
import ReplyToSpace from './messagingSpace/ReplyToSpace';
import ReactionPicker from './messagingSpace/pickerReaction/ReactionPicker';
import LoadingScreen from './messagingSpace/LoadingScreen';
import PinnedMessagesBar from './PinnedMessagesBar';
import socket from './utils/Socket';
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
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(0); // For navigating suggestions
  const [isMentioning, setIsMentioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const [pinnedMsgs, setPinnedMsgs] = useState([]);
  const [prevChat, setPrevChat] = useState(null);
  const [ack, setAck] = useState(null);
  const secretKey = 'our-secret-key';
  let it = 0;
  let it1 = 0;

  const handleNavigateToPinned = () => {
    const msg = messageRefs.current[pinnedMsgs[it1]];
    msg.classList.add('bg-yellow-200');

    msg.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      msg.classList.remove('bg-yellow-200');
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

  // useEffects for socket

  useEffect(() => {
    socket.connect();
    console.log('Attempting to connect to the socket...');
    socket.on('message:send', (message) => {
      console.log('Message received:', message);
      const ackPayload = {
        chatId: 'chat123',
        eventIndex: message.eventIndex, // Required
      };
      socket.emit('ack_event', ackPayload);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
      console.log('dscnnctd');
    };
  }, [openedChat.id]);

  useEffect(() => {
    if (ack) {
      console.log('Acknowledgment received:', ack);
    }
  }, [ack]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
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
      msg.classList.add('bg-yellow-200');

      msg.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        msg.classList.remove('bg-yellow-200');
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
        const sentMessage = {
          id: messages.length + 1,
          ...newMessage,
          content: encryptMessage(newMessage.content),
          chatId: openedChat.id,
          messageType: 'text',
          type: 'sent',
        };
        socket.emit('send_message', newMessage, (response) => {
          // Callback handles server response
          if (response.status === 'success') {
            console.log('Server acknowledgment:', response);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: response.messageId,
                content: inputMessage,
                timestamp: response.metadata.timestamp,
              },
            ]);
            setInputValue(''); // Clear the input field
          } else {
            console.error('Error:', response.message || 'Unknown error');
          }
        });
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

  return (
    <div
      className={`relative flex flex-grow flex-col justify-between ${viewingImage ? '' : 'space-y-4'} overflow-y-auto text-black dark:text-white`}
    >
      <ChatHeader handleKey={handleKey} />
      {pinnedMsgs.length > 0 && (
        <PinnedMessagesBar handleNavigateToPinned={handleNavigateToPinned} />
      )}

      <MessagesList
        messages={messages}
        handlePinMessage={handlePinMessage}
        handleEditMessage={handleEditMessage}
        handleDeleteMessage={handleDeleteMessage}
        handleReplyToMessage={handleReplyToMessage}
        handleImageClick={handleImageClick}
        handleClickForwardMessage={handleClickForwardMessage}
        messagesEndRef={messagesEndRef}
        messageRefs={messageRefs}
      />
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
          <ReplyToSpace
            messages={messages}
            replyToMessageId={replyToMessageId}
            setReplyToMessageId={setReplyToMessageId}
          />
        )}
        <div className="flex items-center space-x-2">
          {/* Emoji/Sticker/GIF Picker Button */}
          <ReactionPicker
            handleSelectItem={handleSelectItem}
            setInputValue={setInputValue}
          />
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
          <AttachMedia
            setErrorMessage={setErrorMessage}
            setSelectedFile={setSelectedFile}
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
        <ViewedImage
          viewingImage={viewingImage}
          handleCloseImageView={handleCloseImageView}
        />
      )}
      {loading && <LoadingScreen />}
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
