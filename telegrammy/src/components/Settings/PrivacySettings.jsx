import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

const PrivacySettings = ({ setView }) => {
  const [profilePictureVisibility, setProfilePictureVisibility] =
    useState('EveryOne');
  const [storiesVisibility, setStoriesVisibility] = useState('EveryOne');
  const [lastSeenVisibility, setLastSeenVisibility] = useState('EveryOne');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [groupAddPermission, setGroupAddPermission] = useState('EveryOne');

  const updateVisibilitySettings = async (newSettings) => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/profile-visibility`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newSettings),
        },
      );

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
    try {
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/read-receipts`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ isEnabled }),
        },
      );

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
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/group-control`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ newPolicy: addToGroups }),
        },
      );

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

  const blockUser = async (username) => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/blocking-status/block`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: username }),
        },
      );

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
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/blocking-status/unblock`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userName: username }),
        },
      );

      if (!response.ok) {
        console.error('Failed to unblock user.');
      } else {
        setBlockedUsers(blockedUsers.filter((user) => user !== username));
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
    <div className="flex min-h-screen w-full flex-col items-center bg-bg-primary p-4 text-text-primary sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="mb-4 flex w-full items-center justify-between">
          <button onClick={() => setView('settings')} className="text-primary">
            Back
          </button>
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
          <div />
        </div>

        {/* Profile Picture Visibility */}
        <div>
          <label>Profile Picture Visibility</label>
          <select
            value={profilePictureVisibility}
            onChange={(e) =>
              handleProfilePictureVisibilityChange(e.target.value)
            }
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Stories Visibility */}
        <div>
          <label>Stories Visibility</label>
          <select
            value={storiesVisibility}
            onChange={(e) => handleStoriesVisibilityChange(e.target.value)}
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Last Seen Visibility */}
        <div>
          <label>Last Seen Visibility</label>
          <select
            value={lastSeenVisibility}
            onChange={(e) => handleLastSeenVisibilityChange(e.target.value)}
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Blocked Users */}
        <div>
          <label>Blocked Users</label>
          <ul>
            {blockedUsers.map((user, index) => (
              <li key={index}>
                {user}
                <button onClick={() => unblockUser(user)}>Unblock</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Block user by username"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                blockUser(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>

        {/* Read Receipts */}
        <div>
          <label>Read Receipts</label>
          <input
            type="checkbox"
            checked={readReceiptsEnabled}
            onChange={handleReadReceiptsChange}
          />
        </div>

        {/* Group Add Permission */}
        <div>
          <label>Who Can Add Me to Groups</label>
          <select
            value={groupAddPermission}
            onChange={(e) => handleGroupAddPermissionChange(e.target.value)}
          >
            <option value="EveryOne">Everyone</option>
            <option value="Admins">Admins</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
