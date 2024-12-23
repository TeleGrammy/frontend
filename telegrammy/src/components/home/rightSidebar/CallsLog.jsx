import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { setOpenedChat } from '../../../slices/chatsSlice';

import { BeatLoader } from 'react-spinners';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import CallLog from './CallLog';

const apiUrl = import.meta.env.VITE_API_URL;

function CallsLog() {
  const dispatch = useDispatch();

  const { chats } = useSelector((state) => state.chats);

  const [calls, setCalls] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = (id) => {
    console.log('id', id);
    const chat = chats.find((chat) => chat.id === id);
    console.log('ana hnaaaaa', chat);
    dispatch(setOpenedChat(chat));
  };

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiUrl}/v1/call/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json', // Specify JSON response expected
          },
          credentials: 'include', // Include credentials (cookies)
        });
        if (!response.ok) {
          throw new Error('Failed to fetch calls');
        }
        const data = await response.json();
        const calls = data.calls;
        console.log(calls);
        setCalls(calls);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [setError, setLoading, setCalls]);

  return (
    <div className="flex h-full w-full flex-col bg-bg-primary">
      {/* Header info */}

      <Header className={'h-[3.4rem] py-5'}>
        <CloseButton />
        <SelectedInfo />
      </Header>

      {/* Calls log */}

      <div className="noScrollable my-3 flex w-full flex-col space-y-5 overflow-auto p-4 text-text-primary">
        {loading && (
          <div className="m-auto h-20">
            <BeatLoader color="gray" size={15} margin={10} />
          </div>
        )}
        {error && (
          <p className="text-red-700">Error loading stories: {error}</p>
        )}
        {!loading && !error && (
          <>
            {calls.length === 0 && <p>No Calls Found</p>}
            {calls.length > 0 &&
              calls.map((call, index) => (
                <CallLog key={index} call={call} handleClick={handleClick} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default CallsLog;
