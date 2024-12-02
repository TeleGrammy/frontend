import React, { useState } from 'react';
import GroupSettings from './GroupSettings'; // Import the GroupSettings component
import { useSelector } from 'react-redux';
import ChannelSettings from './ChannelSettings';
import { FaAngleRight, FaCreativeCommonsShare, FaPlus } from 'react-icons/fa';
import AddUsersList from '../leftSidebar/AddUsersList';
import CloseButton from '../rightSidebar/CloseButton';
import SelectedInfo from '../rightSidebar/SelectedInfo';
import Header from '../leftSidebar/Header';

const initialGroupMembers = [
  {
    username: 'Alice',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: false,
  },
  {
    username: 'Bob',
    photo: 'https://picsum.photos/50/50',
    canComment: true,
    canDownload: false,
  },
  {
    username: 'Charlie',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: true,
  },
  {
    username: 'David',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: false,
  },
  {
    username: 'Eve',
    photo: 'https://picsum.photos/50/50',
    canComment: true,
    canDownload: false,
  },
  {
    username: 'Frank',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: true,
  },
  {
    username: 'Grace',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: false,
  },
  {
    username: 'Hannah',
    photo: 'https://picsum.photos/50/50',
    canComment: true,
    canDownload: false,
  },
  {
    username: 'Isaac',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: true,
  },
  {
    username: 'Jack',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: false,
  },
  {
    username: 'Karen',
    photo: 'https://picsum.photos/50/50',
    canComment: true,
    canDownload: false,
  },
  {
    username: 'Leo',
    photo: 'https://picsum.photos/50/50',
    canComment: false,
    canDownload: true,
  },
];

const initialGroupPhoto = 'https://picsum.photos/50/50';

function GroupOrChannelInfo() {
  const { openedChat } = useSelector((state) => state.chats);

  const [isAdmin, setIsAdmin] = useState(true); // Assume the current user is an admin for demonstration
  const [admins, setAdmins] = useState(['Alice']); // Example of current admins
  const [groupMembers, setGroupMembers] = useState(initialGroupMembers);
  const [addedMembers, setAddedMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupPhoto, setGroupPhoto] = useState(initialGroupPhoto);
  const [groupDescription, setGroupDescription] = useState('hello');
  const [view, setView] = useState('info');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Filtered members based on search query
  const filteredMembers = groupMembers.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const makeAdmin = (username) => {
    if (!admins.includes(username)) {
      setAdmins([...admins, username]);
      console.log(`${username} is now an admin.`);
    }
  };

  const removeMember = (username) => {
    setGroupMembers(
      groupMembers.filter((member) => member.username !== username),
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

  const handleSubmitAddedUsers = () => {};

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

  return (
    <>
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton />
        <SelectedInfo />
        <div className="ml-auto flex flex-row gap-2">
          {openedChat.type === 'Channel' && (
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
        {view === 'edit' && openedChat.type === 'Group' ? (
          <GroupSettings
            groupId={openedChat.id}
            groupPhoto={groupPhoto}
            groupDescription={groupDescription}
            setGroupPhoto={setGroupPhoto}
            setGroupDescription={setGroupDescription}
            toggleView={toggleView}
            isAdmin={isAdmin}
          />
        ) : view === 'edit' && openedChat.type === 'Channel' ? (
          <ChannelSettings toggleView={toggleView} isAdmin={isAdmin} />
        ) : view === 'addUsers' ? (
          <div className="no-scrollbar relative h-full w-full">
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
            <ul className="no-scrollbar mb-4 h-[100%] overflow-y-scroll">
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
                    <img
                      src={member.photo}
                      alt={member.username}
                      className="mr-2 h-8 w-8 rounded-full"
                    />
                    <span className="text-text-primary">{member.username}</span>
                  </div>
                  {isAdmin && (
                    <div
                      className={`mt-2 flex flex-col items-start space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
                        selectedUser === member.username
                          ? 'max-h-40 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {!admins.includes(member.username) && (
                        <button
                          data-test-id={`${member.username}-make-admin-button`}
                          className="text-text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            makeAdmin(member.username);
                          }}
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        data-test-id={`${member.username}-allow-comments-button`}
                        className="text-text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePermission(member.username, 'canComment');
                        }}
                      >
                        {member.canComment
                          ? 'Revoke Comments'
                          : 'Allow Comments'}
                      </button>
                      <button
                        data-test-id={`${member.username}-allow-download-button`}
                        className="text-text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePermission(member.username, 'canDownload');
                        }}
                      >
                        {member.canDownload
                          ? 'Revoke Download'
                          : 'Allow Download'}
                      </button>
                      <button
                        data-test-id={`${member.username}-remove-member-button`}
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMember(member.username);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
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
  );
}

export default GroupOrChannelInfo;
