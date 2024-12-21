import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteButton from './VoiceNoteButton';

import CryptoJS from 'crypto-js';
import Trie from './Trie';
import ChatHeader from './ChatHeader';
import { useSelector } from 'react-redux';
import { MessagesList } from './messages/MessagesList';
import AttachMedia from './messagingSpace/attachment/AttachMedia';
import ViewedImage from './messages/ViewedImage';
import ReplyToSpace from './messagingSpace/ReplyToSpace';
import ReactionPicker from './messagingSpace/pickerReaction/ReactionPicker';
import LoadingScreen from './messagingSpace/LoadingScreen';
import PinnedMessagesBar from './PinnedMessagesBar';
import { useSocket } from '../../../contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { useChats } from '../../../contexts/ChatContext';
import CommentToSpace from './messagingSpace/CommentToSpace';
import Comments from './messages/Comments';
import socket from './utils/Socket';
const userId = JSON.parse(localStorage.getItem('user'))?._id;
const apiUrl = import.meta.env.VITE_API_URL;

const mentionUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];
let trie = new Trie();

const initialComments = [
  {
    id: 1,
    name: 'Ahmed Aladdin',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed-Aladdin', // Replace with actual URL
    timestamp: '٢٠٢٤/١٢/١٨',
    message: 'هو الكويز في الاستراحة ولا ايه؟',
  },
  {
    id: 2,
    name: 'Ahmed Hamdy',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed-Hamdy', // Replace with actual URL
    timestamp: '٢٠٢٤/١٢/١٨',
    message: 'بداية الفترة الثالثة عادي',
  },
];

function Chat() {
  const { socketGeneralRef } = useSocket();

  const [isAdmin, setIsAdmin] = useState(false);
  const { openedChat, searchVisible, searchText } = useSelector(
    (state) => state.chats,
  );
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyToMessageId, setReplyToMessageId] = useState(null);
  const [commentToMessageId, setCommentToMessageId] = useState(null);
  const [forwardingMessageId, setForwardingMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(0); // For navigating suggestions
  const [isMentioning, setIsMentioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShownComments, setIsShownComments] = useState(false);
  const [comments, setComments] = useState([]);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const [pinnedMsgs, setPinnedMsgs] = useState([]);
  const [prevChat, setPrevChat] = useState(null);
  const [ack, setAck] = useState(null);
  const secretKey = 'our-secret-key';
  const dispatch = useDispatch();
  const { chats, setChats } = useChats();
  let it = 0;
  let it1 = 0;

  const handlePinMessage = (messageId, isPinned) => {
    console.log(isPinned);

    if (!isPinned) {
      socketGeneralRef.current.emit('message:pin', {
        chatId: openedChat.id,
        messageId: messageId,
      });
    } else {
      socketGeneralRef.current.emit('message:unpin', {
        chatId: openedChat.id,
        messageId: messageId,
      });
    }
  };

  const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };

  const decryptMessage = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // useEffects for socketGeneralRef.current

  useEffect(() => {
    console.log(openedChat.draft);
    setInputValue(openedChat.draft || '');
    try {
      socketGeneralRef.current.on('error', (err) => {
        console.log(err);
      });
      socketGeneralRef.current.on('draft', (payload) => {
        console.log(payload);
      });
      socketGeneralRef.current.on('message:pin', (payload) => {
        setPinnedMsgs((prevPinnedMsgs) => [
          ...prevPinnedMsgs,
          payload.message._id,
        ]);

        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg._id === payload.message._id) {
              return { ...msg, isPinned: true };
            }
            return msg;
          }),
        );
      });

      socketGeneralRef.current.on('message:unpin', (payload) => {
        setPinnedMsgs((pinnedMsgs) =>
          pinnedMsgs.filter((msg) => msg !== payload.message._id),
        );

        // Updating the messages as well
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === payload.message._id
              ? { ...msg, isPinned: false } // Make sure to avoid mutating state
              : msg,
          ),
        );
      });

      socketGeneralRef.current.on('message:sent', (message) => {
        trie.insert(message.content, message._id);
        console.log(message.senderId);
        if (message.senderId._id !== userId) {
          console.log(socketGeneralRef.current);
          console.log('Message received:', message);
          message['type'] = 'received';
          const ackPayload = {
            chatId: openedChat.id,
            eventIndex: message.eventIndex, // Required
          };
          socketGeneralRef.current.emit('ack_event', ackPayload);
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      socketGeneralRef.current.on('message:updated', (response) => {
        console.log('recieved updated', response);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            const newMessage = { ...msg, ...response };
            if (msg._id === response._id) {
              trie.delete(msg.content, msg._id);
              return newMessage;
            }
            return msg;
          }),
        );
        trie.insert(response.content, response._id);
        setEditingMessageId(null);
      });
      socketGeneralRef.current.on('message:deleted', (response) => {
        console.log('recieved deleted', response);

        setMessages((prevMessages) =>
          prevMessages.filter((msg) => {
            if (msg.messageType !== 'audio' && msg._id === response._id)
              trie.delete(msg.content, msg._id);
            return msg._id !== response._id;
          }),
        );
        setPinnedMsgs((prevMessages) =>
          prevMessages.filter((msg) => msg !== response._id),
        );
      });
    } catch (err) {
      console.log(err);
    }
  }, [socketGeneralRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setCommentToMessageId(null);
    setReplyToMessageId(null);
    const fetchMessages = async () => {
      try {
        if (!openedChat.id) {
          return;
        }
        const response = await fetch(
          `${apiUrl}/v1/chats/chat/${openedChat.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (!response.ok) {
          console.error('Failed to fetch chats.');
        } else {
          console.log('Chats have been fetched successfully.');
        }
        const data = await response.json();
        console.log(data.messages.data);
        let tempMessages = data.messages.data;
        let tempPinned = [];
        tempMessages.map((msg) => {
          if (msg.isPinned) tempPinned.push(msg._id);
          if (msg.senderId._id === userId) {
            msg['type'] = 'sent';
          } else {
            msg['type'] = 'received';
          }
        });
        setPinnedMsgs(tempPinned);

        tempMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );
        tempMessages.map((msg) => trie.insert(msg.content, msg._id));
        setMessages(tempMessages);
      } catch (error) {
        console.error('Error fetching Chats:', error);
      }
    };

    const fetchChannelMessages = async () => {
      try {
        if (!openedChat.channelId) {
          return;
        }
        const response = await fetch(
          `${apiUrl}/v1/channels/${openedChat.channelId}/chat`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (!response.ok) {
          console.error('Failed to fetch chats.');
        } else {
          console.log('Chats have been fetched successfully.');
        }
        const data = await response.json();
        console.log(data);
        let tempMessages = data.messages;
        let tempPinned = [];
        tempMessages.map((msg) => {
          if (msg.isPinned) tempPinned.push(msg._id);
          if (msg.senderId._id === userId) {
            msg['type'] = 'sent';
          } else {
            msg['type'] = 'received';
          }
          if (msg.content.startsWith('https://media1.giphy.com/media/')) {
            msg['isSticker'] = true;
          }
        });
        setPinnedMsgs(tempPinned);

        tempMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );
        tempMessages.map((msg) => trie.insert(msg.content, msg._id));
        setMessages(tempMessages);
      } catch (error) {
        console.error('Error fetching Chats:', error);
      }
    };

    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/v1/channels/${openedChat.channelId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (!response.ok) {
          console.error('Failed to fetch channel info.');
        } else {
          console.log('Channel info have been fetched successfully.');
        }
        const data = await response.json();
        console.log(data);
        setIsAdmin(data.channelOwner.id === userId);
      } catch (error) {
        console.error('Error fetching channel info:', error);
      }
    };

    if (openedChat.isChannel) {
      fetchChannelInfo();
      fetchChannelMessages();
    } else {
      fetchMessages();
    }
  }, [openedChat]);

  const handleSearch = (text) => {
    const ids = trie.startsWith(text);
    if (ids.length > 0) {
      if (it >= ids.length) it = 0;
      console.log(it);
      const msg = messageRefs.current[ids[it++]];
      msg.classList.add('bg-yellow-200');

      msg.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        msg.classList.remove('bg-yellow-200');
      }, 1000);
    } else {
      console.log('empty');
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
    socketGeneralRef.current.emit(
      'draft',
      { chatId: openedChat.id, draft: value },
      (res) => {
        console.log(res);
      },
    );

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

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '' || selectedFile) {
      if (selectedFile) setLoading(true);

      const newMessage = {
        chatId: openedChat.id,
        content: inputValue,
        messageType: 'text',
        isPost: openedChat.isChannel && !commentToMessageId, // and not comment
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().slice(0, 10),
        replyOn: replyToMessageId ? { _id: replyToMessageId } : null, // Link the reply if there's any
        parentPost: commentToMessageId || null,
        type: 'sent',
      };

      if (selectedFile) {
        const formData = new FormData();
        formData.append(selectedFileType.split('_')[0], selectedFile);
        const mediaResponse = await fetch(
          `${apiUrl}/v1/messaging/upload/${selectedFileType.split('_')[0]}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json', // Specify JSON response expected
            },
            credentials: 'include', // Include credentials (cookies)
            body: formData,
          },
        );
        const mediaResponseData = await mediaResponse.json();
        console.log(mediaResponseData);

        newMessage.mediaKey = mediaResponseData.mediaKey;
        newMessage.mediaUrl = mediaResponseData.signedUrl;
        newMessage.messageType =
          selectedFile !== null ? selectedFileType.split('_')[1] : 'text';
      }

      if (editingMessageId) {
        socketGeneralRef.current.emit('message:update', {
          messageId: editingMessageId,
          content: newMessage.content,
        });

        setEditingMessageId(null);
        setInputValue('');
      } else {
        try {
          console.log(newMessage);
          socketGeneralRef.current.emit(
            'message:send',
            newMessage,
            (response) => {
              // Callback handles server response

              if (response.status === 'ok') {
                console.log('Server acknowledgment:', response);
                const newRenderedMessage = {
                  chatId: openedChat.id,
                  _id: response.data.id,
                  content: newMessage.content,
                  type: newMessage.type,
                  timestamp: newMessage.timestamp,
                  mediaKey: newMessage.mediaKey,
                  mediaUrl: newMessage.mediaUrl,
                  messageType: newMessage.messageType,
                  isPinned: false,
                  replyOn: newMessage.replyOn || null,
                };
                console.log(newRenderedMessage);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  newRenderedMessage,
                ]);

                setInputValue('');
              } else {
                console.log(response);
                console.error('Error:', response.message || 'Unknown error');
              }
            },
          );
        } catch (err) {
          console.log(err);
        }
      }

      setInputValue('');
      setReplyToMessageId(null);
      setLoading(false);
    }
  };

  const handleEditMessage = (message) => {
    const messageToEdit = messages.find((msg) => msg._id === message._id);
    if (messageToEdit) {
      setInputValue(messageToEdit.content);
      setEditingMessageId(message._id);
    }
  };

  const handleForwardMessage = (chat) => {
    console.log(chat);
    console.log(forwardingMessageId);
    const message = messages.find((msg) => msg._id === forwardingMessageId);
    socketGeneralRef.current.emit(
      'message:send',
      {
        chatId: chat.id,
        messageId: forwardingMessageId,
        messageType: message.messageType,
        isForwarded: true,
      },
      (response) => {
        console.log(response);
      },
    );
  };
  const handleDeleteMessage = (message) => {
    socketGeneralRef.current.emit(
      'message:delete',
      { messageId: message._id },
      (response) => {
        console.log(response);
      },
    );
  };

  const handleComment = async (parentId) => {
    setCommentToMessageId(parentId);
    setInputValue('');
  };

  const handleClickForwardMessage = (id) => {
    setForwardingMessageId(id);
    setInputValue('');
  };

  const handleReplyToMessage = (id) => {
    setReplyToMessageId(id);
    setInputValue('');
  };

  const handleShowComments = async (postId) => {
    setIsShownComments((prev) => !prev);
    try {
      const response = await fetch(
        `${apiUrl}/v1/channels/thread/${postId}/messages`,
      );
      const data = await response.json();
      console.log(data);
      setComments(data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendVoice = async (audioFormData) => {
    try {
      const mediaResponse = await fetch(`${apiUrl}/v1/messaging/upload/audio`, {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Specify JSON response expected
        },
        credentials: 'include', // Include credentials (cookies)
        body: audioFormData,
      });
      const newMessage = {
        chatId: openedChat.id,
        messageType: 'audio',
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().slice(0, 10),
        replyOn: replyToMessageId ? { _id: replyToMessageId } : null, // Link the reply if there's any
        type: 'sent',
      };
      const mediaResponseData = await mediaResponse.json();
      console.log(mediaResponseData);
      newMessage.mediaKey = mediaResponseData.mediaKey;
      newMessage.mediaUrl = mediaResponseData.signedUrl;
      socketGeneralRef.current.emit('message:send', newMessage, (response) => {
        // Callback handles server response

        if (response.status === 'ok') {
          console.log('Server acknowledgment:', response);
          const newRenderedMessage = {
            chatId: openedChat.id,
            _id: response.data.id,
            content: newMessage.content,
            type: newMessage.type,
            timestamp: newMessage.timestamp,
            mediaKey: newMessage.mediaKey,
            mediaUrl: newMessage.mediaUrl,
            messageType: newMessage.messageType,
            isPinned: false,
            replyOn: newMessage.replyOn || null,
          };
          console.log(newRenderedMessage);
          setMessages((prevMessages) => [...prevMessages, newRenderedMessage]);

          setInputValue('');
        } else {
          console.log(response);
          console.error('Error:', response.message || 'Unknown error');
        }
      });
    } catch (error) {
      console.error('Error sending:', error);
    }
  };

  const handleImageClick = (src) => {
    setViewingImage(src);
  };

  const handleCloseImageView = () => {
    setViewingImage(null);
  };

  const handleSelectItem = async (item) => {
    const newMessage = {
      // id: messages.length + 1,
      // type: 'sent',
      // content: (
      //   <img
      //     key={messages.length + 1}
      //     src={item} // Adjust according to the response structure
      //     alt="Sticker"
      //     width="100"
      //   />
      // ),
      // timestamp: new Date().toLocaleTimeString('en-US', {
      //   hour: 'numeric',
      //   minute: 'numeric',
      // }),
      // date: new Date().toISOString().slice(0, 10),
      // replyOn: replyToMessageId ? { _id: replyToMessageId } : null,
      chatId: openedChat.id,
      messageType: 'text',
      isSticker: true,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      replyOn: replyToMessageId ? { _id: replyToMessageId } : null, // Link the reply if there's any
      type: 'sent',
      messageType: 'text',
      content: item,
    };
    try {
      console.log(newMessage);
      socketGeneralRef.current.emit('message:send', newMessage, (response) => {
        // Callback handles server response

        if (response.status === 'ok') {
          console.log('Server acknowledgment:', response);
          const newRenderedMessage = {
            chatId: openedChat.id,
            _id: response.data.id,
            content: newMessage.content,
            type: newMessage.type,
            timestamp: newMessage.timestamp,
            mediaKey: newMessage.mediaKey,
            mediaUrl: newMessage.mediaUrl,
            messageType: newMessage.messageType,
            isSticker: true,
            isPinned: false,
            replyOn: newMessage.replyOn || null,
          };
          console.log(newRenderedMessage);
          setMessages((prevMessages) => [...prevMessages, newRenderedMessage]);

          setInputValue('');
        } else {
          console.log(response);
          console.error('Error:', response.message || 'Unknown error');
        }
      });
    } catch (err) {
      console.log(err);
    }
    setReplyToMessageId(null);
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
      handleSearch(searchText);
    }
  };

  const handleNavigateToPinned = () => {
    const currentPinnedMsgs = pinnedMsgs; // Use the state directly here
    if (currentPinnedMsgs.length === 0) return; // Early exit if no pinned messages

    const msg = messageRefs.current[currentPinnedMsgs[it1]];

    if (msg) {
      msg.classList.add('bg-yellow-200');
      msg.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        msg.classList.remove('bg-yellow-200');
      }, 1000);
    } else {
      console.error(
        'Message reference not found for pinned message:',
        currentPinnedMsgs[it1],
      );
    }

    // Update the iterator for the next pinned message
    it1++;
    if (it1 >= currentPinnedMsgs.length) it1 = 0;
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
        handleComment={handleComment}
        handleShowComments={handleShowComments}
        handleImageClick={handleImageClick}
        handleClickForwardMessage={handleClickForwardMessage}
        messagesEndRef={messagesEndRef}
        messageRefs={messageRefs}
      />

      {isShownComments && <Comments comments={initialComments} />}

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
        {commentToMessageId && (
          <CommentToSpace
            messages={messages}
            commentToMessageId={commentToMessageId}
            setCommentToMessageId={setCommentToMessageId}
          />
        )}
        {(openedChat.isChannel && isAdmin) ||
        (openedChat.isChannel && !isAdmin && commentToMessageId) ||
        !openedChat.isChannel ? (
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
              onKeyDown={handleKeyDown}
              className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {!(openedChat.isChannel && commentToMessageId) && (
              <>
                <AttachMedia
                  setErrorMessage={setErrorMessage}
                  setSelectedFile={setSelectedFile}
                  setSelectedFileType={setSelectedFileType}
                />
                <VoiceNoteButton onSendVoice={handleSendVoice} />
              </>
            )}
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
        ) : (
          <p className="text-center">You are not an admin in this channel!</p>
        )}
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
                {chats.map((chat) => (
                  <div
                    data-test-id={`${chat.id}-forward-to-div`}
                    key={chat.id}
                    className="flex cursor-pointer flex-row p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      handleForwardMessage(chat);
                    }}
                  >
                    <img
                      src={
                        chat.photo
                          ? chat.photo
                          : 'https://ui-avatars.com/api/?name=' + chat.name
                      }
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
