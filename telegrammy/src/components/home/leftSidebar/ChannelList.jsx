import { useDispatch } from 'react-redux';
import { setcurrentMenu } from '../../../slices/sidebarSlice';
import { useState, useEffect } from 'react';
import AddUsersList from './AddUsersList';
import { FaAngleRight } from 'react-icons/fa';
import { useSocket } from '../../../contexts/SocketContext';
import { use } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

function ChannelList({ channelOrGroup }) {
  const { socketGroupRef, socketChannelRef } = useSocket();
  const [view, setView] = useState('newChannel');
  const [channelName, setChannelName] = useState('');
  const [channelId, setChannelId] = useState(null);
  const [groupId,setGroupId] = useState(null);
  const [description, setDescription] = useState('');
  const [addedMembers, setAddedMembers] = useState([]);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a preview URL
      setImageFile(file);
      setImage(imageUrl);
      console.log(imageUrl);
    }
  };

  useEffect(() => {
    socketGroupRef.current.on('group:created', (message) => {
      console.log('Group created message received:', message);
      setGroupId(message.groupId);
    });

    socketChannelRef.current.on('error', (message) => {
      console.log('error in channel: ', message);
    });
  }, [socketGroupRef, socketChannelRef]); // Empty dependency array means this runs once on mount and cleanup on unmount

  async function handleAddSubsribers() {
    if(channelId){
    try {
      const payload = {
        channelId: channelId,
        subscriberIds: addedMembers,
      };
      console.log('Emitting channel adding subscribers:', payload);

      // Emit the correct message type for creating a group
      socketChannelRef.current.emit(
        'addingChannelSubscriper',
        payload,
        (ackMessage) => {
          console.log('subsriber added successfully', ackMessage);
        },
      );
    } catch (error) {
      console.error('Error in createGroup:', error.message);
    }
  }
  else if(groupId){
    const payload = {
      groupId: groupId,
      userIds:addedMembers
    }
    socketGroupRef.current.emit('addingGroupMember',payload);
  }
  }

  async function handleCreateGroupOrChannel() {
    let mediaUrl = null;
    const createChannel = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/channels/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: channelName,
            description: description,
            image: imageFile ? mediaUrl : null,
          }),
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        setChannelId(data.channelId);
      } catch (error) {
        console.error('Error creating channel:', error.message);
      }
    };

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
    /******  5254d4e3-8f9d-41ed-ad7b-fe9815e54b42  *******/

    const createGroup = async () => {
      let mediaUrl;
      if(imageFile)
      {try {
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
      }}
      try {
        const groupData = {
          name: channelName,
          image: imageFile ? mediaUrl : null,
        };
        console.log('Emitting group creation:', groupData);

        // Emit the correct message type for creating a group
        socketGroupRef.current.emit('creatingGroup', groupData);
      } catch (error) {
        console.error('Error in createGroup:', error.message);
      }
    }
    if (channelOrGroup === 'group') createGroup();
    else {
      if (image) uploadChannelImage().then(createChannel);
      else createChannel();
    }
  }

  return (
    <div className="no-scrollbar flex w-full flex-col items-center overflow-auto bg-bg-primary p-4 text-white sm:p-6">
      {view == 'newChannel' && (
        <div className="flex w-full flex-col items-center p-4 text-text-primary sm:p-6">
          <div className="w-full bg-bg-primary">
            <div className="mb-4 flex w-full items-center justify-between sm:mb-6">
              <button
                data-test-id="go-back-button"
                onClick={() => dispatch(setcurrentMenu('ChatList'))}
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
                data-test-id="new-channel-header"
                className="mr-5 text-xl font-semibold text-text-primary"
              >
                New {channelOrGroup === 'channel' ? 'Channel' : 'Group'}
              </h2>
            </div>

            <div
              className="m-10 flex items-center justify-center"
              data-test-id="image-upload-container"
            >
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  data-test-id="image-input"
                />
                <div
                  className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-purple-500 to-purple-700 text-white"
                  data-test-id="image-preview"
                >
                  {image ? (
                    <img
                      src={image}
                      alt="Uploaded"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label
                  className="block text-sm text-text-primary"
                  htmlFor="channelName"
                >
                  Enter {channelOrGroup === 'channel' ? 'Channel' : 'Group'}{' '}
                  Name
                </label>
                <input
                  data-test-id="channel-name-input"
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
                  placeholder="Channel Name"
                  aria-label="ChannelName"
                />
              </div>

              {channelOrGroup === 'channel' && (
                <div>
                  <label
                    className="block text-sm text-text-primary"
                    htmlFor="description"
                  >
                    Description (Optional)
                  </label>
                  <input
                    data-test-id="description-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
                    placeholder="Description"
                    aria-label="Description"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'addMembers' && (
        <div
          className="relative w-full flex-col text-text-primary"
          data-test-id="add-members-view"
        >
          <div className="w-full bg-bg-primary">
            <div className="mb-4 flex w-full items-center justify-between">
              <button
                data-test-id="go-back-from-members-button"
                onClick={() => dispatch(setcurrentMenu('ChatList'))}
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
                data-test-id="add-members-header"
                className="mr-12 text-xl font-semibold text-text-primary"
              >
                {channelName}
              </h2>
            </div>
            <AddUsersList
              addedMembers={addedMembers}
              setAddedMembers={setAddedMembers}
            />
          </div>
        </div>
      )}

      {((view === 'newChannel' && channelName.length > 0) ||
        view === 'addMembers') && (
        <div
          data-test-id="create-button"
          className="absolute bottom-8 right-8 flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-bg-button text-2xl hover:bg-bg-button-hover"
          onClick={() => {
            if (view === 'newChannel') {
              handleCreateGroupOrChannel();
              setView('addMembers');
            } else if (view === 'addMembers') {
              handleAddSubsribers();
              dispatch(setcurrentMenu('ChatList'));
            }
          }}
        >
          <FaAngleRight className="text-text-primary opacity-70" />
        </div>
      )}
    </div>
  );
}

export default ChannelList;
