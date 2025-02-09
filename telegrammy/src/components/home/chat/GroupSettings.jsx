// GroupSettings.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useSelector } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost';

function GroupSettings({
  groupId,
  groupPhoto,
  groupDescription,
  setGroupPhoto,
  setGroupDescription,
  isAdmin,
  groupSizeLimit,
  setGroupSizeLimit,
  groupPrivacy,
  setGroupPrivacy,
  groupName,
  setGroupName,
  isOwner,
  toggleView,
}) {
  const { socketGroupRef } = useSocket();
  const { openedChat } = useSelector((state) => state.chats);
  const [privacy, setPrivacy] = useState('');
  const [sizeLimit, setSizeLimit] = useState(0);
  const [newDescription, setDescription] = useState('');
  const [newName, setName] = useState(groupName);
  const [selectedFile, setSelectedFile] = useState();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (socketGroupRef && socketGroupRef.current) {
      socketGroupRef.current.on('group:deleted', (message) => {
        console.log('Group deleted', message);
      });
    }
    setPrivacy(groupPrivacy);
    setSizeLimit(groupSizeLimit);
    setDescription(groupDescription);
  }, [groupPrivacy, groupSizeLimit, groupDescription, socketGroupRef]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setSelectedFile(file);
      reader.onloadend = () => {
        setGroupPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleSizeLimitChange = (e) => {
    setSizeLimit(e.target.value);
  };

  const saveChanges = async () => {
    if (selectedFile) {
      try {
        console.log(selectedFile);
        const formData = new FormData();
        formData.append('media', selectedFile);

        const pictureResponse = await fetch(
          `${apiUrl}/v1/messaging/upload/media`,
          {
            method: 'POST',
            credentials: 'include',
            body: formData,
          },
        );

        if (!pictureResponse.ok) {
          console.error('Failed to update profile picture.');
        } else {
          const pictureResult = await pictureResponse.json();
          console.log('Group picture updated successfully:', pictureResult);
          setGroupPhoto(pictureResult.signedUrl);
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
    try {
      const updatedData = {
        name: newName,
        image: groupPhoto,
        description: newDescription,
      };

      const res = await fetch(
        `${apiUrl}/v1/groups/${openedChat.groupId}/info`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedData),
        },
      );

      if (!res.ok) {
        console.error('Failed to update group.');
      } else {
        const result = await res.json();
        console.log('Info updated successfully', result);
        setGroupDescription(newDescription);
        setGroupName(newName);
      }
    } catch (error) {
      console.error('Error updating group settings:', error);
    }
    if (sizeLimit !== groupSizeLimit) {
      try {
        const updatedData = {
          groupSize: sizeLimit,
        };

        const res = await fetch(
          `${apiUrl}/v1/groups/${openedChat.groupId}/size`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedData),
          },
        );

        if (!res.ok) {
          console.error('Failed to update group size.');
        } else {
          const result = await res.json();
          console.log('Size updated successfully', result);
          setGroupSizeLimit(sizeLimit);
        }
      } catch (error) {
        console.error('Error updating group size limit:', error);
      }
    }
    if (groupPrivacy !== privacy) {
      try {
        const updatedData = {
          groupType: privacy,
        };

        const res = await fetch(
          `${apiUrl}/v1/groups/${openedChat.groupId}/group-type`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedData),
          },
        );

        if (!res.ok) {
          console.error('Failed to update group.');
        } else {
          const result = await res.json();
          console.log('Privacy updated successfully', result);
          setGroupPrivacy(privacy);
        }
      } catch (error) {
        console.error('Error updating group settings:', error);
      }
    }
  };

  const deleteGroup = () => {
    const data = {
      groupId: openedChat.groupId,
    };
    if (socketGroupRef && socketGroupRef.current) {
      socketGroupRef.current.emit('removingGroup', data);
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-bg-primary p-4 overflow-y-auto h-full max-h-[80vh] no-scrollbar"
      data-testid="group-settings"
    >
      <h2 className="mb-4 text-center text-text-primary">Edit Group Settings</h2>
      <div className="mb-4 flex flex-col items-center">
        <img
          src={groupPhoto}
          alt="Group"
          className="mb-2 h-16 w-16 rounded-full"
          data-testid="group-photo"
        />
        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="mb-2 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
              data-testid="select-photo-button"
            >
              Select Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
              accept="image/*"
              data-testid="photo-input"
            />
          </>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        {isAdmin ? (
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
            placeholder="Enter new group name"
            data-testid="name-input"
          />
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-testid="group-name"
          >
            {groupName}
          </p>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        {isAdmin ? (
          <input
            type="text"
            value={newDescription}
            onChange={handleDescriptionChange}
            className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
            placeholder="Enter new group description"
            data-testid="description-input"
          />
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-testid="group-description"
          >
            {groupDescription}
          </p>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        <label className="mb-2 block text-sm text-text-primary">
          Group Privacy
        </label>
        {isAdmin ? (
          <select
            value={privacy}
            onChange={handlePrivacyChange}
            className="w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
            data-testid="privacy-select"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-testid="privacy-value"
          >
            {privacy}
          </p>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        <label className="mb-2 block text-sm text-text-primary">
          Group Size Limit
        </label>
        {isAdmin ? (
          <input
            type="number"
            value={sizeLimit}
            onChange={handleSizeLimitChange}
            className="w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Enter group size limit"
            data-testid="size-limit-input"
          />
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-testid="size-limit-value"
          >
            {sizeLimit}
          </p>
        )}
      </div>
      {isAdmin && (
        <button
          className="mb-4 w-3/4 rounded-lg bg-green-500 px-2 py-1 text-white hover:bg-green-600"
          onClick={saveChanges}
          data-testid="save-changes-button"
        >
          Save Changes
        </button>
      )}

      {isOwner && (
        <button
          className="w-3/4 rounded-lg bg-red-700 px-2 py-1 text-white hover:bg-red-800"
          onClick={deleteGroup}
          data-testid="delete-group-button"
        >
          Delete Group
        </button>
      )}
    </div>
  );
}

export default GroupSettings;