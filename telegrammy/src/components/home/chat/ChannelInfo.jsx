import React, { useEffect, useState } from 'react';
import ChannelSettings from './ChannelSettings'; // Import the ChannelSettings component
import { useSelector } from 'react-redux';
import { FaAngleRight, FaCreativeCommonsShare, FaPlus } from 'react-icons/fa';
import AddUsersList from '../leftSidebar/AddUsersList';
import CloseButton from '../rightSidebar/CloseButton';
import SelectedInfo from '../rightSidebar/SelectedInfo';
import Header from '../leftSidebar/Header';
import { useSocket } from '../../../contexts/SocketContext';
import { use } from 'react';
import { ClipLoader } from 'react-spinners';
import LeaveButton from './LeaveButton';
const apiUrl = import.meta.env.VITE_API_URL;
const userId = JSON.parse(localStorage.getItem('user'))?._id;

const initialChannelMembers = [];

const initialChannelPhoto = 'https://picsum.photos/50/50';

function ChannelInfo() {
  const { socketChannelRef } = useSocket();

  const { openedChat } = useSelector((state) => state.chats);
  const [isAdmin, setIsAdmin] = useState(true); // Assume the current user is an admin for demonstration
  const [channelMembers, setChannelMembers] = useState(initialChannelMembers);
  const [addedMembers, setAddedMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [channelPhoto, setChannelPhoto] = useState(initialChannelPhoto);
  const [channelDescription, setChannelDescription] = useState('hello');
  const [view, setView] = useState('info');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [newInput, setNewInput] = useState(''); // State for the new input field
  const [admins, setAdmins] = useState([]);
  const [channelName, setChannelName] = useState();
  const [loading, setLoading] = useState(true); // Loading state

  // Filtered members based on search query
  const filteredMembers = channelMembers.filter((member) =>
    member.userData.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setChannelPhoto(openedChat.photo);

    socketChannelRef.current.on('channel:memberLeft', (message) => {
      console.log('Channel Left:', message);
    });

    socketChannelRef.current.on('error', (message) => {
      console.log('error in channel: ', message);
    });

    const fetchChannelData = async () => {
      setLoading(true); // Start loading
      try {
        const [membersResponse, channelResponse] = await Promise.all([
          fetch(`${apiUrl}/v1/channels/${openedChat.channelId}/participants`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }),
          fetch(`${apiUrl}/v1/channels/${openedChat.channelId}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }),
        ]);

        const membersData = await membersResponse.json();
        const channelData = await channelResponse.json();

        console.log('membersData: ', membersData);
        console.log('channelData: ', channelData);

        setChannelMembers(
          membersData.participants ? membersData.participants : [],
        );
        const channelAdmins = membersData.participants
          .filter((member) => member.role !== 'Subscriber')
          .map((admin) => admin.userData.id);
        console.log(channelAdmins);
        setAdmins(channelAdmins);
        const isUserAdmin = channelAdmins.includes(userId);
        setIsAdmin(isUserAdmin);
        setChannelDescription(channelData.channelDescription);
        setChannelName(channelData.channelName);
        setChannelPhoto(openedChat.photo);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchChannelData();
  }, [socketChannelRef, openedChat]);

  const makeAdmin = async (id) => {
    if (!admins.includes(id)) {
      try {
        const payload = {
          channelId: openedChat.channelId,
          subscriberId: id,
        };
        socketChannelRef.current.emit(
          'promoteSubscriper',
          payload,
          (response) => {
            console.log('promoting subscriber', response);
            setAdmins([...admins, id]);
          },
        );
      } catch (error) {
        console.error('Error updating channel settings:', error);
      }
    }
  };

  const removeMember = (user) => {
    console.log('to remove: ', user);
    const payload = {
      channelId: openedChat.channelId,
      subscriberId: user.userData.id,
    };
    socketChannelRef.current.emit(
      'removingParticipant',
      payload,
      (response) => {
        console.log('removing participant: ', response);
        setChannelMembers(channelMembers.filter((member) => member !== user));
      },
    );
  };

  const leaveChannel = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/channels/${openedChat.channelId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      const data = await response.json();
      console.log('leave channel: ', data);
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const deleteChannel = async () => {
    try {
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

  const setPermissions = (username, permissionType, value) => {
    console.log(`Set ${permissionType} permission for ${username} to ${value}`);
  };

  const toggleUserOptions = (username) => {
    if (selectedUser === username) {
      setSelectedUser(null);
    } else {
      setSelectedUser(username);
    }
  };

  const toggleView = () => {
    setView(view === 'info' ? 'edit' : 'info');
  };

  const GenerateInviteLink = () => {};

  const handleSubmitAddedUsers = () => {
    const payload = {
      channelId: openedChat.channelId,
      subscriberIds: addedMembers,
    };
    socketChannelRef.current.emit(
      'addingChannelSubscriper',
      payload,
      (response) => {
        console.log('adding channel subscriper', response);
        setAddedMembers([]);
        setView('info');
      },
    );
  };

  const togglePermission = (username, permissionType) => {
    setChannelMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.userData.name === username
          ? { ...member, [permissionType]: !member[permissionType] }
          : member,
      ),
    );
    console.log(`Toggled ${permissionType} permission for ${username}`);
  };

  // Function to handle button press
  const handlePrintInput = () => {
    try {
      let arr = [];
      arr.push(newInput);
      const data = {
        channelId: openedChat.channelId,
        phones: arr,
      };
      console.log(data);
      socketChannelRef.current.emit(
        'addingChannelMemberV2',
        data,
        (response) => {
          // Callback handles server response
          if (response.status === 'ok') {
            console.log('Server acknowledgment:', response);
          } else {
            console.log(response);
            console.error('Error:', response.message || 'Unknown error');
          }
        },
      );
    } catch {
      console.log('ERROR');
    }
  };

  const removeAdmin = async (id) => {
    if (admins.includes(id)) {
      try {
        const payload = {
          channelId: openedChat.channelId,
          subscriberId: id,
        };
        socketChannelRef.current.emit('demoteAdmin', payload, (response) => {
          console.log('demoting admin', response);
          setAdmins(admins.filter((admin) => admin !== id));
        });
      } catch (error) {
        console.error('Error demoting admin:', error);
      }
    }
  };

  return (
    <>
      {loading ? ( // Render ClipLoader while loading
        <div className="flex h-full items-center justify-center">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {/* New input field and button */}
          <div className="w-full p-4">
            <input
              type="text"
              placeholder="Type something..."
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)} // Update state on input change
              className="w-full rounded bg-bg-secondary p-2 text-text-primary outline-none"
            />
            <button
              onClick={handlePrintInput} // Call the function on button click
              className="mt-2 rounded-lg bg-bg-secondary px-4 py-2 text-text-primary"
            >
              Print Input
            </button>
          </div>
          {/* Header info */}
          <Header className={'h-[3.4rem]'}>
            <CloseButton />
            <h1 className="text-xl font-bold text-text-primary">
              {channelName}
            </h1>
            <div className="ml-auto flex flex-row gap-2">
              {openedChat.isChannel && (
                <div
                  data-test-id="invite-link-button"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bg-secondary text-3xl hover:bg-bg-button-hover"
                  onClick={GenerateInviteLink}
                >
                  <FaCreativeCommonsShare className="text-text-primary opacity-70" />
                </div>
              )}
              <button
                data-test-id="toggle-edit-info-button"
                className="rounded-lg bg-bg-secondary px-4 py-2 text-text-primary"
                onClick={toggleView}
              >
                {view === 'info' ? 'Edit' : 'Back'}
              </button>
            </div>
          </Header>

          <div className="relative h-[80%] w-[90%] bg-bg-primary">
            {view === 'edit' && openedChat.isChannel ? (
              <ChannelSettings toggleView={toggleView} isAdmin={isAdmin} />
            ) : view === 'addUsers' ? (
              <div className="relative h-full w-full">
                <AddUsersList
                  addedMembers={addedMembers}
                  setAddedMembers={setAddedMembers}
                />
                <div
                  className="fixed bottom-8 right-8 flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-bg-button text-2xl hover:bg-bg-button-hover"
                  onClick={handleSubmitAddedUsers}
                  data-test-id="submit-add-users-button"
                >
                  <FaAngleRight className="text-text-primary opacity-70" />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col items-center">
                  <img
                    src={
                      channelPhoto
                        ? channelPhoto
                        : 'https://ui-avatars.com/api/?name=' + channelName
                    }
                    alt="Channel"
                    className="mb-2 h-16 w-16 rounded-full"
                  />
                </div>
                <p className="mb-2 text-center text-text-primary">
                  {channelDescription}
                </p>
                <h2 className="mb-2 text-center text-text-primary">Members</h2>

                {/* Search bar */}
                <div className="p-4">
                  <input
                    data-test-id="search-in-members-input"
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded bg-bg-secondary p-2 text-text-primary outline-none"
                  />
                </div>

                {/* Display filtered members */}
                <ul className="mb-4 h-full">
                  {filteredMembers.map((member, index) => (
                    <li
                      key={index}
                      className="mb-2 flex flex-col items-start rounded p-2 hover:bg-bg-secondary"
                    >
                      <div
                        data-test-id={`${member.userData.name}-toggle-options-button`}
                        className="flex cursor-pointer items-center justify-center"
                        onClick={() => toggleUserOptions(member.userData.name)}
                      >
                        <img
                          src={
                            member.userData.profilePicture
                              ? member.userData.profilePicture
                              : 'https://ui-avatars.com/api/?name=' +
                                member.userData.name
                          }
                          alt={member.userData.name}
                          className="mr-2 h-8 w-8 rounded-full"
                        />

                        <span className="text-text-primary">
                          {member.userData.name}
                        </span>
                      </div>
                      {isAdmin || member.userData.id === userId ? (
                        <div
                          className={`mt-2 flex flex-col items-start space-y-1 transition-all duration-500 ease-in-out ${
                            selectedUser === member.userData.name
                              ? 'max-h-40 opacity-100'
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          {member.userData.id === userId ? (
                            <button
                              data-test-id={`${member.userData.name}-leave-channel-button`}
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                leaveChannel(member.userData.id);
                              }}
                            >
                              Leave Channel
                            </button>
                          ) : (
                            <>
                              {!admins.includes(member.userData.id) ? (
                                <>
                                  <button
                                    data-test-id={`${member.userData.name}-make-admin-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      makeAdmin(member.userData.id);
                                    }}
                                  >
                                    Make Admin
                                  </button>
                                  <button
                                    data-test-id={`${member.userData.name}-allow-messages-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePermission(
                                        member.userData.name,
                                        'sendMessages',
                                      );
                                    }}
                                  >
                                    {member.sendMessages
                                      ? 'Revoke Messages'
                                      : 'Allow Messages'}
                                  </button>
                                  <button
                                    data-test-id={`${member.userData.name}-allow-download-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePermission(
                                        member.userData.name,
                                        'canDownload',
                                      );
                                    }}
                                  >
                                    {member.canDownload
                                      ? 'Revoke Download'
                                      : 'Allow Download'}
                                  </button>
                                </>
                              ) : (
                                <button
                                  data-test-id={`${member.userData.name}-remove-admin-button`}
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAdmin(member.userData.id);
                                  }}
                                >
                                  Remove Admin
                                </button>
                              )}
                              <button
                                data-test-id={`${member.userData.name}-remove-member-button`}
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMember(member);
                                }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <div
                  className="fixed bottom-10 right-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-bg-button text-xl hover:bg-bg-button-hover"
                  onClick={() => setView('addUsers')}
                  data-test-id="add-memebers-button"
                >
                  <FaPlus className="text-text-primary opacity-70" />
                </div>

                <LeaveButton handleLeave={leaveChannel} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ChannelInfo;
