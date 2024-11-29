import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeRightSidebar,
  setRightSidebar,
} from '../../../slices/sidebarSlice';

function ChatHeader() {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const { openedChat } = useSelector((state) => state.chats);
  const { isRightSidebarOpen } = useSelector((state) => state.sidebar);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (isRightSidebarOpen) {
      dispatch(closeRightSidebar());
    } else {
      dispatch(setRightSidebar(`${openedChat.type} Info`));
    }
  };

  return (
    <div>
      <div
        className="flex cursor-pointer items-center bg-bg-primary p-4"
        onClick={toggleExpand}
      >
        <img
          src={openedChat.picture}
          alt=""
          className="h-10 w-10 rounded-full"
        />
        <h1 className="mb-1 ml-5 text-xl font-semibold text-text-primary">
          {openedChat.name}
        </h1>
      </div>
    </div>
  );
}

export default ChatHeader;
