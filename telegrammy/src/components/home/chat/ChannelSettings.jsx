import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRightSidebar } from '../../../slices/sidebarSlice';

const apiUrl = import.meta.env.VITE_API_URL;

function ChannelSettings({ toggleView, isAdmin }) {
  const dispatch = useDispatch();
  const { openedChat } = useSelector((state) => state.chats);
  const [channelPhoto, setChannelPhoto] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [channelDescription, setChannelDescription] = useState(
    openedChat.description,
  );
  const [channelName, setChannelName] = useState(openedChat.name);
  const [privacy, setPrivacy] = useState('Public');
  const [allowDownload, setAllowDownload] = useState(false); // New state for allow download
  const [allowComments, setAllowComments] = useState(false); // New state for allow comments

  const fileInputRef = useRef(null);

  const handleDescriptionChange = (e) => {
    setChannelDescription(e.target.value);
  };

  const handleNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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

  const saveChanges = async () => {
    let mediaUrl = null;
    const uploadChannelImage = async () => {
      try {
        if (!imageFile) {
          console.error('No image selected.');
          return;
        }
        console.log(imageFile);
        const formData = new FormData();
        formData.append('media', imageFile);
        const mediaResponse = await fetch(
          `${apiUrl}/v1/messaging/upload/media`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
            },
            credentials: 'include',
            body: formData,
          },
        );
        if (!mediaResponse.ok) {
          console.error(
            `Error uploading channel image: ${mediaResponse.status} ${mediaResponse.statusText}`,
          );
          return;
        }

        const mediaResponseData = await mediaResponse.json();
        console.log(mediaResponseData);
        mediaUrl = mediaResponseData.signedUrl;
      } catch (error) {
        console.error('Error uploading channel image:', error.message);
      }
    };

    const updateAll = async () => {
      if (isAdmin) {
        console.log('Channel description:', channelDescription);
        console.log('Channel photo URL:', channelPhoto);
        console.log('Channel privacy:', privacy);
        console.log(openedChat);
        try {
          const privacyResponse = await fetch(
            `${apiUrl}/v1/channels/${openedChat.channelId}/privacy`,
            {
              method: 'PATCH',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                privacy: privacy === 'Public',
                comments: allowComments,
                download: allowDownload,
              }),
              credentials: 'include',
            },
          );
          const privacyData = await privacyResponse.json();
          console.log(privacyData);

          const updateResponse = await fetch(
            `${apiUrl}/v1/channels/${openedChat.channelId}`,
            {
              method: 'PATCH',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: channelName,
                description: channelDescription,
                image: mediaUrl,
              }),
              credentials: 'include',
            },
          );
          const updateData = await updateResponse.json();
          console.log(updateData);
          dispatch(closeRightSidebar());
        } catch (error) {
          console.error('Error creating channel:', error.message);
        }

        // Logic to save changes to the server or state
      } else {
        console.log('Only admins can save changes.');
      }
    };

    if (channelPhoto) {
      uploadChannelImage().then(updateAll);
    }
  };

  const deleteChannel = async () => {
    try {
      const newChats = chats.filter(
        (chat) => chat.channelId !== openedChat.channelId,
      );
      dispatch(setChats(newChats));
      dispatch(closeRightSidebar());
      const payload = {
        channelId: openedChat.channelId,
      };

      socketChannelRef.current.emit('removingChannel', payload, (response) => {
        console.log('removingChannel: ', response);
      });
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-bg-primary p-4">
      <h2 className="mb-4 text-center text-text-primary">
        Edit Channel Settings
      </h2>
      <div className="mb-4 flex flex-col items-center">
        <img
          src={
            channelPhoto
              ? channelPhoto
              : 'https://ui-avatars.com/api/?name=' + openedChat.name
          }
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
          <>
            <input
              data-test-id="description-input"
              type="text"
              value={channelName}
              onChange={handleNameChange}
              className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
              placeholder="Enter new Name"
            />
            <input
              data-test-id="description-input"
              type="text"
              value={channelDescription}
              onChange={handleDescriptionChange}
              className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
              placeholder="Enter new Description"
            />
          </>
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
        {isAdmin && (
          <div className="mt-4 flex w-3/4 flex-col items-start">
            <label className="mb-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={() => setAllowDownload(!allowDownload)}
                className="mr-2"
              />
              Allow Download
            </label>
            <label className="mb-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={() => setAllowComments(!allowComments)}
                className="mr-2"
              />
              Allow Comments
            </label>
          </div>
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
