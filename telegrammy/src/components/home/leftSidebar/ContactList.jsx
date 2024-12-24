import { useDispatch } from 'react-redux';
import { setcurrentMenu } from '../../../slices/sidebarSlice';
import React, { useEffect, useState } from 'react';
import { FaAngleRight, FaGhost } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function ContactList() {
  const [searchType, setSearchType] = useState('user');
  const [choice, setChoice] = useState('User Name');
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const [expandedResultId, setExpandedResultId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedResultId((prevId) => (prevId === id ? null : id));
  };

  function handleAddContact(input) {
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
        dispatch(setcurrentMenu('ChatList'));
      } catch (error) {
        console.error('Error addind to contacts:', error.message);
      }
    };
    addContact();
  }

  async function handleJoinChannel(channelId) {
    try {
      const response = await axios.post(
        `${apiUrl}/v1/channels/${channelId}/join`,
        {},
        {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        },
      );
      console.log('Successfully joined the channel:', response.data);
      dispatch(setcurrentMenu('ChatList'));
    } catch (error) {
      console.error('Error joining channel:', error.message);
    }
  }

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;

    // Allow only numeric characters for phone numbers
    if (choice === 'Phone Number') {
      if (/^\d*$/.test(inputValue)) {
        setInput(inputValue);
      }
    } else {
      setInput(inputValue);
    }
  };

  const handleSearch = async () => {
    console.log('searching...');
    try {
      const params = new URLSearchParams({
        type: searchType,
        ...{ uuid: input },
        ...(searchType !== 'user' && { name: input }),
        limit: 50,
      });

      const response = await fetch(
        `${apiUrl}/v1/search/global-search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      // Filter the results based on the selected choice
      const filteredResults =
        searchType !== 'user'
          ? data.data[searchType] || []
          : (data.data[searchType] || []).filter((result) => {
              if (choice === 'User Name') {
                return result.username
                  ?.toLowerCase()
                  .includes(input.toLowerCase());
              } else if (choice === 'Email') {
                return result.email
                  ?.toLowerCase()
                  .includes(input.toLowerCase());
              } else if (choice === 'Phone Number') {
                return result.phone?.includes(input);
              } else if (choice === 'Screen Name') {
                return result.screenName?.includes(input);
              }
              return true; // Default case
            });

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching:', error.message);
    }
  };

  useEffect(() => {
    setSearchResults([]);
  }, [searchType, choice, input]);

  return (
    <div className="no-scrollbar flex w-full flex-col items-center overflow-auto bg-bg-primary p-4 text-white sm:p-6">
      <div className="flex w-full flex-col items-center p-4 text-text-primary sm:p-6">
        <div className="w-full bg-bg-primary">
          <div className="mb-4 flex w-full items-center justify-between sm:mb-6">
            <button
              data-testid="go-back-button"
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
              data-testid="new-contact-header"
              className="m-auto text-xl font-semibold text-text-primary"
            >
              Search
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="search-type"
                className="block text-sm text-text-primary"
              >
                Search for:
              </label>
              <select
                id="search-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary outline-none sm:px-4 sm:py-2"
              >
                <option value="user">User</option>
                <option value="group">Group</option>
                <option value="channel">Channel</option>
              </select>
            </div>
            {searchType === 'user' && (
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
                  <option value="Screen Name">Screen Name</option>
                  <option value="Email">Email</option>
                  <option value="Phone Number">Phone Number</option>
                </select>
              </div>
            )}
            <div>
              <label
                className="block text-sm text-text-primary"
                htmlFor="searchInput"
              >
                Enter {choice}
              </label>
              <input
                data-testid="search-input"
                type={
                  choice === 'User Name' || choice === 'Phone Number'
                    ? 'text'
                    : 'email'
                }
                value={input}
                onChange={handleChangeInput}
                className="mt-2 w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary outline-none sm:px-4 sm:py-2"
                placeholder=""
                aria-label="SearchInput"
              />
            </div>
          </div>
        </div>
      </div>
      {input.length > 0 && (
        <button
          data-testid="search-button"
          className="mt-4 rounded-lg bg-bg-button px-4 py-2 text-text-primary hover:bg-bg-button-hover"
          onClick={handleSearch}
        >
          Search
        </button>
      )}
      {searchResults.length > 0 ? (
        <div className="mt-6 w-full space-y-4">
          <h3 className="text-lg font-semibold">Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li
                key={result._id}
                className="flex flex-col space-y-4 rounded-lg bg-bg-secondary p-3 text-xxs text-text-primary transition hover:bg-gray-700"
                onClick={() => toggleExpand(result._id)}
              >
                <div className="flex cursor-pointer items-center space-x-4">
                  <img
                    src={
                      result.picture ||
                      'https://ui-avatars.com/api/?name=' +
                        (result.username || result.name)
                    }
                    alt={result.username || result.name || 'User'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {searchType === 'user'
                        ? result.username
                        : result.name || 'N/A'}
                    </p>
                    {searchType === 'user' && (
                      <p className="text-gray-400">
                        {result.screenName || 'No screenName provided'}
                      </p>
                    )}
                    {searchType === 'user' && (
                      <p className="text-gray-400">
                        {result.email || 'No email provided'}
                      </p>
                    )}
                    {searchType === 'user' && result.phone && (
                      <p className="text-gray-400">Phone: {result.phone}</p>
                    )}
                  </div>
                </div>
                {expandedResultId === result._id &&
                  (searchType === 'user' || searchType === 'channel') && (
                    <button
                      className="self-start rounded-lg bg-bg-button px-3 py-2 font-semibold text-text-primary hover:bg-bg-button-hover"
                      onClick={() => {
                        if (searchType === 'user')
                          handleAddContact(result.username);
                        else handleJoinChannel(result._id);
                      }}
                    >
                      {searchType === 'user' ? 'Add to Contacts' : 'Join'}
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="m-auto mt-14 text-2xl font-bold text-text-secondary">
          <div className="mb-4 flex justify-center text-5xl">
            <FaGhost />
          </div>
          No results found
        </p>
      )}
    </div>
  );
}

export default ContactList;
