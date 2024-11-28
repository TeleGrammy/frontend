import React, { useState, useRef } from 'react';

function GroupSettings({ groupId, groupPhoto, groupDescription, setGroupPhoto, setGroupDescription, isAdmin, toggleView }) {
  const [privacy, setPrivacy] = useState('Public');
  const [sizeLimit, setSizeLimit] = useState(1000);
  const [muteDuration, setMuteDuration] = useState('None');
  const fileInputRef = useRef(null);

  const handleDescriptionChange = (e) => {
    setGroupDescription(e.target.value);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
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

  const handleMuteChange = (e) => {
    setMuteDuration(e.target.value);
  };

  const saveChanges = () => {
    if (isAdmin) {
      console.log('Group description:', groupDescription);
      console.log('Group photo URL:', groupPhoto);
      console.log('Group privacy:', privacy);
      console.log('Group size limit:', sizeLimit);
      console.log('Mute duration:', muteDuration);
      setGroupDescription(groupDescription);
      setGroupPhoto(groupPhoto);
      toggleView('info');
      // Logic to save changes to the server or state
    } else {
      console.log('Only admins can save changes.');
    }
  };

  const leaveGroup = () => {
    console.log('Leaving the group...');
    // Logic to leave the group
  };

  const deleteGroup = () => {
    if (isAdmin) {
      console.log('Deleting the group...');
      // Logic to delete the group
    } else {
      console.log('Only admins can delete the group.');
    }
  };

  return (
    <div className="p-4 bg-bg-primary flex flex-col items-center">
      <h2 className="text-text-primary mb-4 text-center">Edit Group Settings</h2>
      <div className="flex flex-col items-center mb-4">
        <img src={groupPhoto} alt="Group" className="w-16 h-16 rounded-full mb-2" />
        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-bg-secondary text-text-primary rounded-lg px-2 py-1 mb-2"
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
      <div className="mb-4 w-full flex flex-col items-center">
        {isAdmin ? (
          <input
            type="text"
            value={groupDescription}
            onChange={handleDescriptionChange}
            className="w-3/4 px-2 py-1 bg-bg-secondary rounded-lg text-text-primary mb-2 text-center"
            placeholder="Enter new group description"
          />
        ) : (
          <p className="text-text-primary mb-2 text-center">{groupDescription}</p>
        )}
      </div>
      <div className="mb-4 w-full flex flex-col items-center">
        <label className="block text-sm text-text-primary mb-2">Group Privacy</label>
        {isAdmin ? (
          <select
            value={privacy}
            onChange={handlePrivacyChange}
            className="w-3/4 px-2 py-1 bg-bg-secondary rounded-lg text-text-primary"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        ) : (
          <p className="text-text-primary mb-2 text-center">{privacy}</p>
        )}
      </div>
      <div className="mb-4 w-full flex flex-col items-center">
        <label className="block text-sm text-text-primary mb-2">Group Size Limit</label>
        {isAdmin ? (
          <input
            type="number"
            value={sizeLimit}
            onChange={handleSizeLimitChange}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-3/4 px-2 py-1 bg-bg-secondary rounded-lg text-text-primary"
            placeholder="Enter group size limit"
          />
        ) : (
          <p className="text-text-primary mb-2 text-center">{sizeLimit}</p>
        )}
      </div>
      <div className="mb-4 w-full flex flex-col items-center">
        <label className="block text-sm text-text-primary mb-2">Mute Notifications</label>
        <select
          value={muteDuration}
          onChange={handleMuteChange}
          className="w-3/4 px-2 py-1 bg-bg-secondary rounded-lg text-text-primary"
        >
          <option value="None">None</option>
          <option value="1 Hour">1 Hour</option>
          <option value="8 Hours">8 Hours</option>
          <option value="1 Day">1 Day</option>
          <option value="Permanent">Permanent</option>
        </select>
      </div>
      {isAdmin && (
        <button
          className="w-3/4 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg mb-4"
          onClick={saveChanges}
        >
          Save Changes
        </button>
      )}
      <button
        className="w-3/4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mb-4"
        onClick={leaveGroup}
      >
        Leave Group
      </button>
      {isAdmin && (
        <button
          className="w-3/4 bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded-lg"
          onClick={deleteGroup}
        >
          Delete Group
        </button>
      )}
    </div>
  );
}

export default GroupSettings;
