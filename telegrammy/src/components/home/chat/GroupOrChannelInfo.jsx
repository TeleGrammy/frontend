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
  { username: 'Alice', photo: 'https://picsum.photos/50/50' },
  { username: 'Bob', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Alice', photo: 'https://picsum.photos/50/50' },
  { username: 'Bob', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Alice', photo: 'https://picsum.photos/50/50' },
  { username: 'Bob', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
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

  const addMember = () => {
    console.log(`Add member to group with ID: ${openedChat.id}`);
  };

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
    console.log(`${username} has been removed from the group.`);
  };

  const setPermissions = (username, permissionType, value) => {
    console.log(`Set ${permissionType} permission for ${username} to ${value}`);
  };

  const toggleUserOptions = (username) => {
    setSelectedUser(selectedUser === username ? null : username);
  };

  const toggleView = () => {
    setView(view === 'info' ? 'edit' : 'info');
  };

  const GenerateInviteLink = () => {};

  const handleSubmitAddedUsers = () => {};

  return (
    <>
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton />
        <SelectedInfo />
        <div className="ml-auto flex flex-row gap-2">
          {openedChat.type === 'Channel' && (
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bg-secondary text-3xl hover:bg-bg-button-hover"
              onClick={GenerateInviteLink}
              data-test-id="invite-link-button"
            >
              <FaCreativeCommonsShare className="text-text-primary opacity-70" />
            </div>
          )}
          <button
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
              data-test-id="create-button"
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
            <ul className="no-scrollbar mb-4 h-[100%] overflow-y-scroll">
              {groupMembers.map((member, index) => (
                <li
                  key={index}
                  className="mb-2 flex flex-col items-start rounded p-2 hover:bg-bg-secondary"
                  onClick={() => toggleUserOptions(member.username)}
                >
                  <div className="flex items-center justify-center">
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
                        className="text-text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPermissions(member.username, 'comment', true);
                        }}
                      >
                        Allow Comments
                      </button>
                      <button
                        className="text-text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPermissions(member.username, 'download', true);
                        }}
                      >
                        Allow Download
                      </button>
                      <button
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
