import React, { useState } from 'react';

const PrivacySettings = ({ setView }) => {
  const [profilePictureVisibility, setProfilePictureVisibility] = useState('Everyone');
  const [storiesVisibility, setStoriesVisibility] = useState('Everyone');
  const [lastSeenVisibility, setLastSeenVisibility] = useState('Everyone');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [groupAddPermission, setGroupAddPermission] = useState('Everyone');

  const handleBlockUser = (username) => {
    setBlockedUsers([...blockedUsers, username]);
  };

  const handleUnblockUser = (username) => {
    setBlockedUsers(blockedUsers.filter(user => user !== username));
  };

  return (
    <div className="bg-bg-primary w-full text-text-primary min-h-screen flex flex-col items-center p-4 sm:p-6 overflow-auto no-scrollbar">
      <div className="w-full max-w-md sm:max-w-lg bg-bg-primary">
        <div className="w-full flex justify-between items-center mb-4 sm:mb-6">
          <button
            data-test-id="settings"
            onClick={() => setView('settings')}
            className="text-text-primary hover:text-gray-300"
            aria-label="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Privacy Settings</h2>
          <div></div>
        </div>

        {/* Profile Picture Visibility */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Profile Picture Visibility</label>
          <select
            value={profilePictureVisibility}
            onChange={(e) => setProfilePictureVisibility(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
          >
            <option value="Everyone">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Stories Visibility */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Stories Visibility</label>
          <select
            value={storiesVisibility}
            onChange={(e) => setStoriesVisibility(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
          >
            <option value="Everyone">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Last Seen Visibility */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Last Seen Visibility</label>
          <select
            value={lastSeenVisibility}
            onChange={(e) => setLastSeenVisibility(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
          >
            <option value="Everyone">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Blocked Users */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Blocked Users</label>
          <ul className="list-disc pl-5 text-text-primary">
            {blockedUsers.map((user, index) => (
              <li key={index} className="flex justify-between">
                {user}
                <button
                data-test-id="unblocking-user"
                  onClick={() => handleUnblockUser(user)}
                  className="text-red-500 hover:text-red-700"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
          <input
          data-test-id="blocking-user"
            type="text"
            placeholder="Enter username to block"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary mt-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                handleBlockUser(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>

        {/* Read Receipts */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Read Receipts</label>
          <div className="flex items-center text-text-primary">
            <input
            data-test-id="read-receipts"
              type="checkbox"
              checked={readReceiptsEnabled}
              onChange={() => setReadReceiptsEnabled(!readReceiptsEnabled)}
              className="mr-2"
            />
            <span>{readReceiptsEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        {/* Group Add Permission */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm text-text-primary">Who Can Add Me to Groups/Channels</label>
          <select
            value={groupAddPermission}
            onChange={(e) => setGroupAddPermission(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
          >
            <option value="Everyone">Everyone</option>
            <option value="Admins">Admins</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings; 