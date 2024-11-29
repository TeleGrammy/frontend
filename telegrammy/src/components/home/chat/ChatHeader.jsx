import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { setSearchText, setSearchVisible } from '../../../slices/chatsSlice';
import {
  closeRightSidebar,
  setRightSidebar,
} from '../../../slices/sidebarSlice';

function ChatHeader({ handleKey }) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      dispatch(setRightSidebar(`${openedChat.type} Info`));
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

  return (
    <>
      <div>
        <div className="flex items-center bg-bg-primary p-4">
          <img
            data-test-id="chat-image"
            src={openedChat.picture}
            alt=""
            className="h-10 w-10 cursor-pointer rounded-full"
            onClick={toggleExpand}
          />
          <h1 className="mb-1 ml-5 text-xl font-semibold text-text-primary">
            {openedChat.name}
          </h1>
          {searchVisible ? (
            <div className="ml-auto flex items-center">
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
                data-test-id="close-search-in-chat-button"
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={toggleSearch}
              />
            </div>
          ) : (
            <FaSearch
              data-test-id="open-search-in-chat-button"
              className="ml-auto cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={toggleSearch}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ChatHeader;
