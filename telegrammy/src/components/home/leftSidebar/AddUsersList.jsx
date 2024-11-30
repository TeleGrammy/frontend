import React, { useState } from 'react';

const contacts = [
  {
    id: 1,
    name: '3bd El7akim Cairo University',
    lastSeen: 'Nov 21 at 23:00',
    avatar: '3U',
  },
  { id: 2, name: 'Abd El-Rahman Mostafa', lastSeen: 'recently', avatar: 'AM' },
  { id: 3, name: 'Abdallah Salah', lastSeen: 'Nov 23 at 15:11', avatar: 'AS' },
  {
    id: 4,
    name: 'Abdelrahman Mohamed Siemens',
    lastSeen: 'Nov 19 at 15:40',
    avatar: 'AS',
  },
  {
    id: 5,
    name: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  { id: 6, name: 'Abdulrahman Samy', lastSeen: '1 minute ago', avatar: 'AS' },
  {
    id: 7,
    name: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 8,
    name: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  { id: 9, name: 'Adham Hussin', lastSeen: 'Nov 1 at 15:42', avatar: 'AH' },
  {
    id: 10,
    name: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  { id: 11, name: 'Abdulrahman Samy', lastSeen: '1 minute ago', avatar: 'AS' },
  {
    id: 12,
    name: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 13,
    name: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  { id: 14, name: 'Adham Hussin', lastSeen: 'Nov 1 at 15:42', avatar: 'AH' },
  {
    id: 15,
    name: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  { id: 16, name: 'Abdulrahman Samy', lastSeen: '1 minute ago', avatar: 'AS' },
  {
    id: 17,
    name: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 18,
    name: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  { id: 19, name: 'Adham Hussin', lastSeen: 'Nov 1 at 15:42', avatar: 'AH' },
];

const AddUsersList = ({ addedMembers, setAddedMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered users based on search term
  const filteredContacts = contacts.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCheckboxChange = (user) => {
    if (addedMembers.includes(user)) {
      // Remove the user if already added
      setAddedMembers((prev) => prev.filter((member) => member !== user));
    } else {
      // Add the user if not already added
      setAddedMembers((prev) => [...prev, user]);
    }
    console.log(addedMembers);
  };

  return (
    <div className="h-full w-full rounded-lg text-text-primary shadow-md">
      <div className="mb-2 pb-2">
        <input
          type="text"
          placeholder="Add people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="w-full rounded-lg bg-bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-test-id="search-input"
        />
      </div>
      <ul
        className="no-scrollbar flex h-[90%] flex-col overflow-y-auto"
        data-test-id="user-list"
      >
        {filteredContacts.length > 0 ? (
          filteredContacts.map((user) => (
            <li
              key={user.id}
              className="flex items-center space-x-3 rounded-lg p-2 hover:bg-bg-hover"
              data-test-id={`user-item-${user.id}`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white"
                data-test-id={`user-avatar-${user.id}`}
              >
                {user.avatar}
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-medium"
                  data-test-id={`user-name-${user.id}`}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs text-gray-400"
                  data-test-id={`user-last-seen-${user.id}`}
                >
                  last seen {user.lastSeen}
                </p>
              </div>
              <input
                type="checkbox"
                checked={addedMembers.includes(user)}
                onChange={() => handleCheckboxChange(user)}
                className="h-5 w-5 text-blue-500 focus:ring-blue-400"
                data-test-id={`user-checkbox-${user.id}`}
              />
            </li>
          ))
        ) : (
          <p
            className="text-center text-gray-400"
            data-test-id="no-users-message"
          >
            No users found
          </p>
        )}
      </ul>
    </div>
  );
};

export default AddUsersList;
