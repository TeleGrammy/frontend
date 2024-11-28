import React, { useState } from 'react';
import GroupSettings from './GroupSettings'; // Import the GroupSettings component

function GroupInfo({ groupId }) {
  const [isAdmin, setIsAdmin] = useState(true); // Assume the current user is an admin for demonstration
  const [admins, setAdmins] = useState(['Alice']); // Example of current admins
  const [groupMembers, setGroupMembers] = useState([
    { username: 'Alice', photo: 'https://picsum.photos/50/50' },
    { username: 'Bob', photo: 'https://picsum.photos/50/50' },
    { username: 'Charlie', photo: 'https://picsum.photos/50/50' },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupPhoto, setGroupPhoto] = useState('https://picsum.photos/50/50');
  const [groupDescription, setGroupDescription] = useState('hello');
  const [view, setView] = useState('info');

  const addMember = () => {
    console.log(`Add member to group with ID: ${groupId}`);
  };

  const makeAdmin = (username) => {
    if (!admins.includes(username)) {
      setAdmins([...admins, username]);
      console.log(`${username} is now an admin.`);
    }
  };

  const removeMember = (username) => {
    setGroupMembers(groupMembers.filter(member => member.username !== username));
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

  return (
    <div className="p-4 bg-bg-primary">
      <button
        className="bg-bg-secondary text-text-primary rounded-lg  px-4 py-2 ml-44"
        onClick={toggleView}
      >
        {view === 'info' ? 'Edit' : 'Back'}
      </button>

      {view === 'edit' ? (
        <GroupSettings
          groupId={groupId}
          groupPhoto={groupPhoto}
          groupDescription={groupDescription}
          setGroupPhoto={setGroupPhoto}
          setGroupDescription={setGroupDescription}
          toggleView={toggleView}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <img src={groupPhoto} alt="Group" className="w-16 h-16 rounded-full mb-2" />
          </div>
          <p className="text-text-primary mb-2 text-center">{groupDescription}</p>
          <h2 className='text-text-primary mb-2 text-center'>Members</h2>
          <ul className="mb-4">
            {groupMembers.map((member, index) => (
              <li
                key={index}
                className="flex flex-col items-center mb-2 hover:bg-bg-secondary p-2 rounded"
                onClick={() => toggleUserOptions(member.username)}
              >
                <div className="flex items-center justify-center">
                  <img src={member.photo} alt={member.username} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-text-primary">{member.username}</span>
                </div>
                {isAdmin && (
                  <div
                    className={`flex flex-col items-center mt-2 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
                      selectedUser === member.username ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
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
                        setPermissions(member.username, 'post', true);
                      }}
                    >
                      Allow Post
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
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 mx-auto block"
            onClick={addMember}
          >
            Add Members
          </button>
        </>
      )}
    </div>
  );
}

export default GroupInfo;
