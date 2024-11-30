import React, { useState, useRef } from 'react';

function GroupSettings({
  groupId,
  groupPhoto,
  groupDescription,
  setGroupPhoto,
  setGroupDescription,
  isAdmin,
  toggleView,
}) {
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
    <div
      className="flex flex-col items-center bg-bg-primary p-4"
      data-test-id="group-settings"
    >
      <h2 className="mb-4 text-center text-text-primary">
        Edit Group Settings
      </h2>
      <div className="mb-4 flex flex-col items-center">
        <img
          src={groupPhoto}
          alt="Group"
          className="mb-2 h-16 w-16 rounded-full"
          data-test-id="group-photo"
        />
        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="mb-2 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
              data-test-id="select-photo-button"
            >
              Select Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
              accept="image/*"
              data-test-id="photo-input"
            />
          </>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        {isAdmin ? (
          <input
            type="text"
            value={groupDescription}
            onChange={handleDescriptionChange}
            className="mb-2 w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-center text-text-primary"
            placeholder="Enter new group description"
            data-test-id="description-input"
          />
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-test-id="group-description"
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
            data-test-id="privacy-select"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-test-id="privacy-value"
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
            data-test-id="size-limit-input"
          />
        ) : (
          <p
            className="mb-2 text-center text-text-primary"
            data-test-id="size-limit-value"
          >
            {sizeLimit}
          </p>
        )}
      </div>
      <div className="mb-4 flex w-full flex-col items-center">
        <label className="mb-2 block text-sm text-text-primary">
          Mute Notifications
        </label>
        <select
          value={muteDuration}
          onChange={handleMuteChange}
          className="w-3/4 rounded-lg bg-bg-secondary px-2 py-1 text-text-primary"
          data-test-id="mute-duration-select"
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
          className="mb-4 w-3/4 rounded-lg bg-green-500 px-2 py-1 text-white hover:bg-green-600"
          onClick={saveChanges}
          data-test-id="save-changes-button"
        >
          Save Changes
        </button>
      )}
      <button
        className="mb-4 w-3/4 rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        onClick={leaveGroup}
        data-test-id="leave-group-button"
      >
        Leave Group
      </button>
      {isAdmin && (
        <button
          className="w-3/4 rounded-lg bg-red-700 px-2 py-1 text-white hover:bg-red-800"
          onClick={deleteGroup}
          data-test-id="delete-group-button"
        >
          Delete Group
        </button>
      )}
    </div>
  );
}

export default GroupSettings;
