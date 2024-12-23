import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FaSearch, FaTimes } from 'react-icons/fa';
import { setSearchText, setSearchVisible } from '../../../slices/chatsSlice';
import {
  closeRightSidebar,
  setRightSidebar,
} from '../../../slices/sidebarSlice';
import Caller from '../voicecall/Caller';
import JoinCall from '../voicecall/JoinCall';

const apiUrl = import.meta.env.VITE_API_URL;

function ChatHeader({ handleKey }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCall, setActiveCall] = useState({});

  const dispatch = useDispatch();

  const { openedChat, searchVisible, searchText } = useSelector(
    (state) => state.chats,
  );
  const { isRightSidebarOpen } = useSelector((state) => state.sidebar);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (isRightSidebarOpen) {
      dispatch(closeRightSidebar());
    } else {
      if (openedChat?.isGroup) dispatch(setRightSidebar(`Group Info`));
      else if (openedChat?.isChannel) dispatch(setRightSidebar('Channel Info'));
    }
  };

  const toggleSearch = () => {
    dispatch(setSearchVisible(!searchVisible)); // Toggle search visibility
    if (searchVisible) {
      dispatch(setSearchText('')); // Clear search text when closing search
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchText(event.target.value)); // Update search text in state
  };

  useEffect(() => {
    const checkOnGoingCall = async () => {
      try {
        if (openedChat?.id) {
          const response = await fetch(`${apiUrl}/v1/call/${openedChat.id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json', // Specify JSON response expected
            },
            credentials: 'include', // Include credentials (cookies)
          });
          if (!response.ok) {
            throw new Error('Failed to fetch checkOnGoingCall');
          }
          const data = await response.json();
          const call = data.call;
          // console.log('call from header', call);
          setActiveCall(call);
        }
      } catch (error) {
        console.error('Failed to fetch checkOnGoingCall', error);
      }
    };

    //checkOnGoingCall();
  }, [openedChat, setActiveCall]);

  return (
    <>
      <div>
        {openedChat && (
          <div className="flex flex-row items-center justify-between bg-bg-primary p-4">
            <div className="flex flex-row">
              <img
                data-test-id="chat-image"
                src={
                  openedChat?.photo
                    ? openedChat?.photo
                    : 'https://ui-avatars.com/api/?name=' + openedChat?.name
                }
                alt=""
                className="h-10 w-10 cursor-pointer rounded-full"
                onClick={toggleExpand}
              />

              <h1 className="mb-1 ml-5 text-xl font-semibold text-text-primary">
                {openedChat?.name}
              </h1>
            </div>
            <div className="flex flex-row items-center space-x-3">
              {searchVisible ? (
                <>
                  <input
                    data-test-id="search-in-chat-input"
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    className="mr-2 rounded border border-gray-300 p-1 text-gray-500 focus:outline-none" // Apply gray text color
                    placeholder="Search..."
                    onKeyDown={handleKey}
                  />
                  <FaTimes
                    size={17}
                    data-test-id="close-search-in-chat-button"
                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                    onClick={toggleSearch}
                  />
                </>
              ) : (
                <FaSearch
                  size={17}
                  data-test-id="open-search-in-chat-button"
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={toggleSearch}
                />
              )}
              {Object.keys(activeCall).length !== 0 ? (
                <JoinCall
                  activeCall={activeCall}
                  setActiveCall={setActiveCall}
                />
              ) : (
                <Caller />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChatHeader;
