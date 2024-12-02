import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

function ChannelSettings({ toggleView, isAdmin }) {
  const { openedChat } = useSelector((state) => state.chats);
  const [channelPhoto, setChannelPhoto] = useState(openedChat.picture);
  const [channelDescription, setChannelDescription] = useState(
    openedChat.description,
  );
  const [privacy, setPrivacy] = useState('Public');
  const fileInputRef = useRef(null);

  const handleDescriptionChange = (e) => {
    setChannelDescription(e.target.value);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setChannelPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const saveChanges = () => {
    if (isAdmin) {
      console.log('Channel description:', channelDescription);
      console.log('Channel photo URL:', channelPhoto);
      console.log('Channel privacy:', privacy);
      console.log('Mute duration:', muteDuration);
      setChannelDescription(channelDescription);
      setChannelPhoto(channelPhoto);
      toggleView('info');
      // Logic to save changes to the server or state
    } else {
      console.log('Only admins can save changes.');
    }
  };

  const leaveChannel = () => {
    console.log('Leaving the Channel...');
    // Logic to leave the Channel
  };

  const deleteChannel = () => {
    if (isAdmin) {
      console.log('Deleting the Channel...');
      // Logic to delete the Channel
    } else {
      console.log('Only admins can delete the Channel.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-bg-primary p-4">
      <h2 className="mb-4 text-center text-text-primary">
        Edit Channel Settings
      </h2>
      <div className="mb-4 flex flex-col items-center">
        <img
          src={channelPhoto}
          alt="Channel"
          className="mb-2 h-16 w-16 rounded-full"
        />
        {isAdmin && (
          <>
            <button
              data-test-id="select-photo-button"
              onClick={() => fileInputRef.current.click()}
              className="mb-2 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
            >
              Select Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        {isAdmin ? (
          <input
            data-test-id="description-input"
            type="text"
            value={channelDescription}
            onChange={handleDescriptionChange}
            className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
            placeholder="Enter new Channel description"
          />
        ) : (
          <p className="mb-2 text-center text-text-primary">
            {channelDescription}
          </p>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        <label className="mb-2 block text-sm text-text-primary">
          Channel Privacy
        </label>
        {isAdmin ? (
          <select
            data-test-id="privacy-select"
            value={privacy}
            onChange={handlePrivacyChange}
            className="w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        ) : (
          <p className="mb-2 text-center text-text-primary">{privacy}</p>
        )}
      </div>
      {isAdmin && (
        <button
          data-test-id="save-changes-button"
          className="mb-4 w-3/4 rounded-lg bg-green-500 px-2 py-1 text-white hover:bg-green-600"
          onClick={saveChanges}
        >
          Save Changes
        </button>
      )}
      <button
        data-test-id="leave-channel-button"
        className="mb-4 w-3/4 rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        onClick={leaveChannel}
      >
        Leave Channel
      </button>
      {isAdmin && (
        <button
          data-test-id="delete-channel-button"
          className="w-3/4 rounded-lg bg-red-700 px-2 py-1 text-white hover:bg-red-800"
          onClick={deleteChannel}
        >
          Delete Channel
        </button>
      )}
    </div>
  );
}

export default ChannelSettings;
