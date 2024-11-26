import React, { useState } from 'react';

const PrivacySettings = ({ setView }) => {
  const [profilePictureVisibility, setProfilePictureVisibility] = useState('Everyone');
  const [storiesVisibility, setStoriesVisibility] = useState('Everyone');
  const [lastSeenVisibility, setLastSeenVisibility] = useState('Everyone');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [groupAddPermission, setGroupAddPermission] = useState('Everyone');

  const updateVisibilitySettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:8080/privacy/settings/profile-visibility', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        console.error('Failed to update visibility settings.');
      } else {
        console.log('Visibility settings updated successfully.');
      }
    } catch (error) {
      console.error('Error updating visibility settings:', error);
    }
  };

  const updateReadReceipts = async (isEnabled) => {
    const updatedData = {
      isEnabled: isEnabled,
    };
    try {
      const response = await fetch('http://localhost:8080/privacy/settings/read-receipts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        console.error('Failed to update read receipts.');
      } else {
        console.log('Read receipts updated successfully.');
      }
    } catch (error) {
      console.error('Error updating read receipts:', error);
    }
  };

  const updateGroupControl = async (addToGroups) => {
    try {
      const response = await fetch('http://localhost:8080/privacy/settings/group-control', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addToGroups }),
      });

      if (!response.ok) {
        console.error('Failed to update group control.');
      } else {
        console.log('Group control updated successfully.');
      }
    } catch (error) {
      console.error('Error updating group control:', error);
    }
  };

  const handleProfilePictureVisibilityChange = (value) => {
    setProfilePictureVisibility(value);
    updateVisibilitySettings({
      profilePicture: value,
      stories: storiesVisibility,
      lastSeen: lastSeenVisibility,
    });
  };

  const handleStoriesVisibilityChange = (value) => {
    setStoriesVisibility(value);
    updateVisibilitySettings({
      profilePicture: profilePictureVisibility,
      stories: value,
      lastSeen: lastSeenVisibility,
    });
  };

  const handleLastSeenVisibilityChange = (value) => {
    setLastSeenVisibility(value);
    updateVisibilitySettings({
      profilePicture: profilePictureVisibility,
      stories: storiesVisibility,
      lastSeen: value,
    });
  };

  const handleBlockUser = (username) => {
    blockUser(username);
  };

  const handleUnblockUser = (username) => {
    unblockUser(username);
  };

  const blockUser = async (username) => {
    try {
      const response = await fetch('http://localhost:8080/privacy/settings/blocked-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username }),
      });

      if (!response.ok) {
        console.error('Failed to block user.');
      } else {
        setBlockedUsers([...blockedUsers, username]);
        console.log('User blocked successfully.');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const unblockUser = async (username) => {
    try {
      const response = await fetch('http://localhost:8080/privacy/settings/blocked-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username }),
      });

      if (!response.ok) {
        console.error('Failed to unblock user.');
      } else {
        setBlockedUsers(blockedUsers.filter(user => user !== username));
        console.log('User unblocked successfully.');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleReadReceiptsChange = () => {
    const newValue = !readReceiptsEnabled;
    setReadReceiptsEnabled(newValue);
    updateReadReceipts(newValue);
  };

  const handleGroupAddPermissionChange = (value) => {
    setGroupAddPermission(value);
    updateGroupControl(value);
  };

  return (
    <div className="bg-bg-primary w-full text-text-primary min-h-screen flex flex-col items-center p-4 sm:p-6 overflow-auto no-scrollbar">
      <div className="w-full max-w-md sm:max-w-lg bg-bg-primary">
        <div className="w-full flex justify-between items-center mb-4 sm:mb-6">
          <button
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
            onChange={(e) => handleProfilePictureVisibilityChange(e.target.value)}
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
            onChange={(e) => handleStoriesVisibilityChange(e.target.value)}
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
            onChange={(e) => handleLastSeenVisibilityChange(e.target.value)}
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
          <div className="bg-bg-secondary rounded-lg p-3">
            {blockedUsers.length > 0 ? (
              <ul className="space-y-2">
                {blockedUsers.map((user, index) => (
                  <li key={index} className="flex justify-between items-center bg-bg-primary p-2 rounded-md">
                    <span>{user}</span>
                    <button
                      onClick={() => handleUnblockUser(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No blocked users</p>
            )}
          </div>
          <input
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
              type="checkbox"
              checked={readReceiptsEnabled}
              onChange={handleReadReceiptsChange}
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
            onChange={(e) => handleGroupAddPermissionChange(e.target.value)}
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