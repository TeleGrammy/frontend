import React from 'react';

import { HiOutlinePhoneMissedCall } from 'react-icons/hi';
import { FiPhoneCall } from 'react-icons/fi';
import { MdCallEnd } from 'react-icons/md';

const statusStyles = {
  rejected: {
    color: 'text-red-500',
    text: 'Declined',
    icon: <HiOutlinePhoneMissedCall size={15} />,
  },
  ongoing: {
    color: 'text-blue-500',
    text: 'OnGoing',
    icon: <FiPhoneCall size={15} />,
  },
  ended: {
    color: 'text-green-500',
    text: 'Ended',
    icon: <MdCallEnd size={15} />,
  },
};

const formatDate = (date) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}

function CallLog({ call, handleClick }) {
  const { startedAt, duration, status, chatId, chatDetails } = call;

  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  const imageUrl = chatDetails.isGroup
    ? chatDetails.groupId.image
    : chatDetails.participants.find(
        (participant) => participant.userId !== currentUserId,
      ).profile.picture;

  const name = chatDetails.isGroup
    ? chatDetails.groupId.name
    : chatDetails.participants.find(
        (participant) => participant.userId !== currentUserId,
      ).profile.username;

  const { color, text, icon } = statusStyles[status];

  return (
    <div
      onClick={() => handleClick(chatId)}
      className="flex cursor-pointer flex-row items-center justify-between space-x-4 rounded-lg bg-bg-secondary p-3 shadow-md transition-shadow duration-200 hover:shadow-lg"
    >
      {/* Circle Image */}
      <div>
        <img
          src={imageUrl || 'https://ui-avatars.com/api/?name=' + name}
          alt="image of chat"
          className="h-12 w-12 rounded-full object-cover"
        />
      </div>

      {/* Call Details */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
        <p className="text-xs text-text-primary">
          Started At: {formatDate(startedAt)}
        </p>
        <p className="text-sm text-text-primary">
          Duration: {formatTime(duration)}
        </p>
      </div>

      {/* Call Status */}
      <div
        className={`flex flex-row items-center space-x-1 ${color} font-bold`}
      >
        <span className="text-sm">{text}</span>
        {icon}
      </div>
    </div>
  );
}

export default CallLog;
