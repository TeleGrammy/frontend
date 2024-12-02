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
          headers: {
            'Content-Type': 'application/json',
          },
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
    const updatedData = {
      isEnabled: isEnabled,
    };
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
          body: JSON.stringify(updatedData),
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
    const updatedData = {
      newPolicy: addToGroups,
    };
    try {
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/group-control`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedData),
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

  const handleBlockUser = (username) => {
    blockUser(username);
  };

  const handleUnblockUser = (username) => {
    unblockUser(username);
  };

  const blockUser = async (username) => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/privacy/settings/blocking-status/block`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
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
          headers: {
            'Content-Type': 'application/json',
          },
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
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center overflow-auto bg-bg-primary p-4 text-text-primary sm:p-6">
      <div className="w-full max-w-md bg-bg-primary sm:max-w-lg">
        <div className="mb-4 flex w-full items-center justify-between sm:mb-6">
          <button
            data-testid="privacy-go-back"
            onClick={() => setView('settings')}
            className="text-text-primary hover:text-gray-300"
            aria-label="Go Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2
            data-testid="privacy-title"
            className="text-xl font-semibold text-text-primary sm:text-2xl"
          >
            Privacy Settings
          </h2>
          <div></div>
        </div>

        {/* Profile Picture Visibility */}
        <div className="mb-3 sm:mb-4">
          <label
            className="block text-sm text-text-primary"
            htmlFor="profile-picture-visibility"
          >
            Profile Picture Visibility
          </label>
          <select
            data-testid="profile-picture-visibility"
            value={profilePictureVisibility}
            onChange={(e) =>
              handleProfilePictureVisibilityChange(e.target.value)
            }
            className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Stories Visibility */}
        <div className="mb-3 sm:mb-4">
          <label
            className="block text-sm text-text-primary"
            htmlFor="stories-visibility"
          >
            Stories Visibility
          </label>
          <select
            data-testid="stories-visibility"
            value={storiesVisibility}
            onChange={(e) => handleStoriesVisibilityChange(e.target.value)}
            className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Last Seen Visibility */}
        <div className="mb-3 sm:mb-4">
          <label
            className="block text-sm text-text-primary"
            htmlFor="last-seen-visibility"
          >
            Last Seen Visibility
          </label>
          <select
            data-testid="last-seen-visibility"
            value={lastSeenVisibility}
            onChange={(e) => handleLastSeenVisibilityChange(e.target.value)}
            className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
          >
            <option value="EveryOne">Everyone</option>
            <option value="Contacts">Contacts</option>
            <option value="Nobody">Nobody</option>
          </select>
        </div>

        {/* Blocked Users */}
        <div className="mb-3 sm:mb-4">
          <label
            className="block text-sm text-text-primary"
            htmlFor="blocked-users"
          >
            Blocked Users
          </label>
          <div
            data-testid="blocked-users-list"
            className="rounded-lg bg-bg-secondary p-3"
          >
            {blockedUsers.length > 0 ? (
              <ul className="space-y-2">
                {blockedUsers.map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md bg-bg-primary p-2"
                  >
                    <span data-testid={`blocked-user-${index}`}>{user}</span>
                    <button
                      data-testid={`unblock-user-${index}`}
                      onClick={() => handleUnblockUser(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                data-testid="no-blocked-users"
                className="text-sm text-gray-500"
              >
                No blocked users
              </p>
            )}
          </div>
          <input
            type="text"
            placeholder="Enter username to block"
            className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
            data-testid="block-user-input"
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
          <label className="block text-sm text-text-primary">
            Read Receipts
          </label>
          <div className="flex items-center text-text-primary">
            <input
              type="checkbox"
              data-testid="read-receipts-checkbox"
              checked={readReceiptsEnabled}
              onChange={handleReadReceiptsChange}
              className="mr-2"
            />
            <span data-testid="read-receipts-status">
              {readReceiptsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Group Add Permission */}
        <div className="mb-3 sm:mb-4">
          <label
            className="block text-sm text-text-primary"
            htmlFor="group-add-permission"
          >
            Who Can Add Me to Groups/Channels
          </label>
          <select
            data-testid="group-add-permission"
            value={groupAddPermission}
            onChange={(e) => handleGroupAddPermissionChange(e.target.value)}
            className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
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
