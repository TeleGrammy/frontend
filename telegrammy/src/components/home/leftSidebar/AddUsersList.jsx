import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

const init = [
  {
    id: 1,
    screenName: '3bd El7akim Cairo University',
    lastSeen: 'Nov 21 at 23:00',
    avatar: '3U',
  },
  {
    id: 2,
    screenName: 'Abd El-Rahman Mostafa',
    lastSeen: 'recently',
    avatar: 'AM',
  },
  {
    id: 3,
    screenName: 'Abdallah Salah',
    lastSeen: 'Nov 23 at 15:11',
    avatar: 'AS',
  },
  {
    id: 4,
    screenName: 'Abdelrahman Mohamed Siemens',
    lastSeen: 'Nov 19 at 15:40',
    avatar: 'AS',
  },
  {
    id: 5,
    screenName: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  {
    id: 6,
    screenName: 'Abdulrahman Samy',
    lastSeen: '1 minute ago',
    avatar: 'AS',
  },
  {
    id: 7,
    screenName: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 8,
    screenName: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  {
    id: 9,
    screenName: 'Adham Hussin',
    lastSeen: 'Nov 1 at 15:42',
    avatar: 'AH',
  },
  {
    id: 10,
    screenName: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  {
    id: 11,
    screenName: 'Abdulrahman Samy',
    lastSeen: '1 minute ago',
    avatar: 'AS',
  },
  {
    id: 12,
    screenName: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 13,
    screenName: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  {
    id: 14,
    screenName: 'Adham Hussin',
    lastSeen: 'Nov 1 at 15:42',
    avatar: 'AH',
  },
  {
    id: 15,
    screenName: 'Abdulrahman Abdul Aaty',
    lastSeen: 'Nov 25 at 17:08',
    avatar: 'AA',
  },
  {
    id: 16,
    screenName: 'Abdulrahman Samy',
    lastSeen: '1 minute ago',
    avatar: 'AS',
  },
  {
    id: 17,
    screenName: 'Adham Abd Elazeem',
    lastSeen: 'yesterday at 23:54',
    avatar: 'AE',
  },
  {
    id: 18,
    screenName: 'Adham Abd Elnaser',
    lastSeen: 'Nov 19 at 10:50',
    avatar: 'AE',
  },
  {
    id: 19,
    screenName: 'Adham Hussin',
    lastSeen: 'Nov 1 at 15:42',
    avatar: 'AH',
  },
];

const AddUsersList = ({ addedMembers, setAddedMembers }) => {
  const [contacts, setContacts] = useState([]);

  const handleCheckboxChange = (user) => {
    if (addedMembers.includes(user.contactId._id)) {
      // Remove the user if already added
      setAddedMembers((prev) =>
        prev.filter((memberId) => memberId !== user.contactId._id),
      );
    } else {
      // Add the user if not already added
      setAddedMembers((prev) => [...prev, user.contactId._id]);
    }
    console.log(addedMembers);
  };

  useEffect(() => {
    // Fetch user data from the endpoint
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/v1/privacy/settings/get-contacts`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            credentials: 'include',
          },
        );
        const data = await response.json();
        console.log(data);
        console.log(data.data);
        console.log(data.data.contacts[0].contactId._id);
        console.log(
          data.data.contacts[0].contactId.screenName[0] +
            data.data.contacts[0].contactId.screenName[1],
        );
        setContacts(data.data.contacts);
      } catch (error) {
        console.error('Error fetching user contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="h-full w-full rounded-lg text-text-primary shadow-md">
      <ul
        className="no-scrollbar flex h-[90%] flex-col overflow-y-auto"
        data-test-id="user-list"
      >
        {contacts.map((contact) => (
          <li
            key={contact.contactId._id}
            onClick={() => handleCheckboxChange(contact)}
            className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-bg-hover"
            data-test-id={`user-item-${contact.contactId._id}`}
          >
            {contact.contactId.picture ? (
              <img
                src={contact.contactId.picture}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white"
                data-test-id={`user-avatar-${contact.contactId._id}`}
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white"
                data-test-id={`user-avatar-${contact.contactId._id}`}
              >
                {' '}
                {contact.contactId.screenName[0] +
                  contact.contactId.screenName[1]}{' '}
              </div>
            )}
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                data-test-id={`user-name-${contact.contactId._id}`}
              >
                {contact.contactId.screenName}
              </p>
              <p
                className="text-xs text-gray-400"
                data-test-id={`user-last-seen-${contact.contactId._id}`}
              >
                {contact.contactId.username}
              </p>
            </div>
            <input
              type="checkbox"
              checked={addedMembers.includes(contact.contactId._id)}
              className="h-5 w-5 text-blue-500 focus:ring-blue-400"
              data-test-id={`user-checkbox-${contact.contactId._id}`}
            />
          </li>
        ))}
      </ul>
    </div>
    // <div></div>
  );
};

export default AddUsersList;
