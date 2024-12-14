import React, { useEffect, useState } from 'react';
import GroupSettings from './GroupSettings'; // Import the GroupSettings component
import { useSelector } from 'react-redux';
import ChannelSettings from './ChannelSettings';
import { FaAngleRight, FaCreativeCommonsShare, FaPlus } from 'react-icons/fa';
import AddUsersList from '../leftSidebar/AddUsersList';
import CloseButton from '../rightSidebar/CloseButton';
import SelectedInfo from '../rightSidebar/SelectedInfo';
import Header from '../leftSidebar/Header';
import { useSocket } from '../../../contexts/SocketContext';
import { use } from 'react';
import { ClipLoader } from 'react-spinners';
const apiUrl = import.meta.env.VITE_API_URL;
const userId = JSON.parse(localStorage.getItem('user'))?._id;

const initialGroupMembers = [];

const initialGroupPhoto = 'https://picsum.photos/50/50';

function GroupOrChannelInfo() {
  const socket = useSocket();

  const { openedChat } = useSelector((state) => state.chats);
  const [isAdmin, setIsAdmin] = useState(true); // Assume the current user is an admin for demonstration
  const [groupMembers, setGroupMembers] = useState(initialGroupMembers);
  const [addedMembers, setAddedMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupPhoto, setGroupPhoto] = useState(initialGroupPhoto);
  const [groupDescription, setGroupDescription] = useState('hello');
  const [view, setView] = useState('info');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [newInput, setNewInput] = useState(''); // State for the new input field
  const [admins, setAdmins] = useState([]);
  const [groupSizeLimit, setGroupSizeLimit] = useState();
  const [groupPrivacy, setGroupPrivacy] = useState();
  const [groupName, setGroupName] = useState();
  const [loading, setLoading] = useState(true); // Loading state

  // Filtered members based on search query
  const filteredMembers = groupMembers.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setGroupPhoto(openedChat.photo);

    socket.current.on('group:memberLeft', (message) => {
      console.log('Group Left:', message);
    });

    const fetchGroupData = async () => {
      setLoading(true); // Start loading
      try {
        const [membersResponse, adminsResponse, groupResponse] =
          await Promise.all([
            fetch(`${apiUrl}/v1/groups/${openedChat.groupId}/members`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
              credentials: 'include',
            }),
            fetch(`${apiUrl}/v1/groups/${openedChat.groupId}/admins`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
              credentials: 'include',
            }),
            fetch(`${apiUrl}/v1/groups/${openedChat.groupId}/`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
              credentials: 'include',
            }),
          ]);

        const membersData = await membersResponse.json();
        const adminsData = await adminsResponse.json();
        const groupData = await groupResponse.json();

        setGroupMembers(membersData.data.members);
        setAdmins(adminsData.data.admins.map((admin) => admin.id));
        const isUserAdmin = adminsData.data.admins.some(
          (member) => member.id === userId,
        );
        setIsAdmin(isUserAdmin);
        setGroupDescription(groupData.data.group.description);
        setGroupName(groupData.data.group.name);
        setGroupPhoto(groupData.data.group.image);
        setGroupPrivacy(groupData.data.group.groupType);
        setGroupSizeLimit(groupData.data.group.groupSizeLimit);
        console.log(groupMembers);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchGroupData();

    return () => {
      socket.current.disconnect();
      console.log('Disconnected');
    };
  }, [socket]);

  const makeAdmin = async (id) => {
    if (!admins.includes(id)) {
      setAdmins([...admins, id]);
      try {
        const res = await fetch(
          `${apiUrl}/v1/groups/${openedChat.groupId}/admins/${id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (!res.ok) {
          console.error('Failed to update group.');
        } else {
          const result = await res.json();
          console.log('Info updated successfully', result);
        }
      } catch (error) {
        console.error('Error updating group settings:', error);
      }
    }
  };

  const removeMember = (username) => {
    setGroupMembers(
      groupMembers.filter((member) => member.username !== username.username),
    );
    const data = {
      groupId: openedChat.groupId,
      userId: username.id,
    };
    socket.current.emit('removingParticipant', data);
  };

  const leaveGroup = async (id) => {
    const data = {
      groupId: openedChat.groupId,
    };
    socket.current.emit('leavingGroup', data);

    // Remove the member from the groupMembers state
    setGroupMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id),
    );
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
    setView('info');
  };

  const togglePermission = (username, permissionType) => {
    setGroupMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.username === username
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
        groupId: openedChat.groupId,
        phones: arr,
      };
      console.log(data);
      socket.current.emit('addingGroupMemberV2', data, (response) => {
        // Callback handles server response
        if (response.status === 'ok') {
          console.log('Server acknowledgment:', response);
        } else {
          console.log(response);
          console.error('Error:', response.message || 'Unknown error');
        }
      });
    } catch {
      console.log('ERROR');
    }
  };

  const removeAdmin = async (id) => {
    if (admins.includes(id)) {
      setAdmins(admins.filter((admin) => admin !== id));
      try {
        const res = await fetch(
          `${apiUrl}/v1/groups/${openedChat.groupId}/admins/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (!res.ok) {
          console.error('Failed to remove admin.');
        } else {
          const result = await res.json();
          console.log('Admin removed successfully', result);
        }
      } catch (error) {
        console.error('Error updating group settings:', error);
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
            <h1 className="text-xl font-bold text-text-primary">{groupName}</h1>
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
            {view === 'edit' && openedChat.isGroup ? (
              <GroupSettings
                groupId={openedChat.id}
                groupPhoto={groupPhoto}
                groupDescription={groupDescription}
                setGroupPhoto={setGroupPhoto}
                setGroupDescription={setGroupDescription}
                toggleView={toggleView}
                isAdmin={isAdmin}
                groupSizeLimit={groupSizeLimit}
                setGroupSizeLimit={setGroupSizeLimit}
                groupName={groupName}
                setGroupName={setGroupName}
                groupPrivacy={groupPrivacy}
                setGroupPrivacy={setGroupPrivacy}
              />
            ) : view === 'edit' && openedChat.isChannel ? (
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
                    src={groupPhoto}
                    alt="Group"
                    className="mb-2 h-16 w-16 rounded-full"
                  />
                </div>
                <p className="mb-2 text-center text-text-primary">
                  {groupDescription}
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
                        data-test-id={`${member.username}-toggle-options-button`}
                        className="flex cursor-pointer items-center justify-center"
                        onClick={() => toggleUserOptions(member.username)}
                      >
                        {member.picture !== null ? (
                          <img
                            src={member.picture}
                            alt={member.username}
                            className="mr-2 h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                            <span className="ml-0.5 text-text-primary">👤</span>
                          </div>
                        )}
                        <span className="text-text-primary">
                          {member.username}
                        </span>
                      </div>
                      {isAdmin || member.id === userId ? (
                        <div
                          className={`mt-2 flex flex-col items-start space-y-1 transition-all duration-500 ease-in-out ${
                            selectedUser === member.username
                              ? 'max-h-40 opacity-100'
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          {member.id === userId ? (
                            <button
                              data-test-id={`${member.username}-leave-group-button`}
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                leaveGroup(member.id);
                              }}
                            >
                              Leave Group
                            </button>
                          ) : (
                            <>
                              {!admins.includes(member.id) ? (
                                <>
                                  <button
                                    data-test-id={`${member.username}-make-admin-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      makeAdmin(member.id);
                                    }}
                                  >
                                    Make Admin
                                  </button>
                                  <button
                                    data-test-id={`${member.username}-allow-messages-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePermission(
                                        member.username,
                                        'sendMessages',
                                      );
                                    }}
                                  >
                                    {member.sendMessages
                                      ? 'Revoke Messages'
                                      : 'Allow Messages'}
                                  </button>
                                  <button
                                    data-test-id={`${member.username}-allow-download-button`}
                                    className="text-text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePermission(
                                        member.username,
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
                                  data-test-id={`${member.username}-remove-admin-button`}
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAdmin(member.id);
                                  }}
                                >
                                  Remove Admin
                                </button>
                              )}
                              <button
                                data-test-id={`${member.username}-remove-member-button`}
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
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default GroupOrChannelInfo;
