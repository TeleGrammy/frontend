import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeRightSidebar, setRightSidebar } from '../../../slices/sidebarSlice';

function ChatHeader({groupName,groupPhoto}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if(!isExpanded){
      dispatch(closeRightSidebar());
    }else{
      dispatch(setRightSidebar('Group Info'));
    }
  };

  return (
    <div>
      <div
        className="flex items-center p-4 bg-bg-primary cursor-pointer"
        onClick={toggleExpand}
      >
        <img src={groupPhoto} alt="" className='w-10 h-10 rounded-full' />
        <h1 className="text-xl font-semibold text-text-primary ml-5 mb-1">{groupName}</h1>
      </div>
    </div>
  );
}

export default ChatHeader;
