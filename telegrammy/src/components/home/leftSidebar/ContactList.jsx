import { useDispatch } from 'react-redux';
import { setcurrentMenu } from '../../../slices/sidebarSlice';
import { useState } from 'react';
import AddUsersList from './AddUsersList';
import { FaAngleRight } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function ContactList() {
  const [choice, setChoice] = useState('User Name');
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;

    // Allow only numeric characters
    if (choice === 'Phone Number') {
      if (/^\d*$/.test(inputValue)) {
        setInput(inputValue);
      }
    } else {
      setInput(inputValue);
    }
  };

  function handleAddContact() {
    const addContact = async () => {
      console.log(input);
      try {
        const response = await axios.post(
          `${apiUrl}/v1/chats/fetch-contacts`,
          {
            contacts: [`${input}`],
          },
          {
            headers: {
              Accept: 'application/json',
            },
            withCredentials: true, // Equivalent to 'credentials: include' in fetch
          },
        );
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.error('Error creating group or channel:', error.message);
      }
    };
    addContact();
  }

  return (
    <div className="no-scrollbar flex w-full flex-col items-center overflow-auto bg-bg-primary p-4 text-white sm:p-6">
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
              New Contact
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="user-choice"
                className="block text-sm text-text-primary"
              >
                Choose an option:
              </label>
              <select
                id="user-choice"
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
                className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary outline-none sm:px-4 sm:py-2"
              >
                <option value="User Name">User Name</option>
                <option value="Email">Email</option>
                <option value="Phone Number">Phone Number</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm text-text-primary"
                htmlFor="channelName"
              >
                Enter {choice}
              </label>
              <input
                data-test-id="channel-name-input"
                type={
                  choice === 'User Name' || choice === 'Phone Number'
                    ? 'text'
                    : 'email'
                }
                value={input}
                onChange={handleChangeInput}
                className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary outline-none sm:px-4 sm:py-2"
                placeholder=""
                aria-label="ChannelName"
              />
            </div>
          </div>
        </div>
      </div>
      {input.length > 0 && (
        <div
          data-test-id="create-button"
          className="absolute bottom-8 right-8 flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-bg-button text-2xl hover:bg-bg-button-hover"
          onClick={() => {
            handleAddContact();
            dispatch(setcurrentMenu('ChatList'));
          }}
        >
          <FaAngleRight className="text-text-primary opacity-70" />
        </div>
      )}
    </div>
  );
}

export default ContactList;
