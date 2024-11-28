import { useDispatch } from 'react-redux';
import { setcurrentMenu } from '../../../slices/sidebarSlice';
import { useState } from 'react';
import AddUsersList from './AddUsersList';
import { FaAngleRight } from 'react-icons/fa';

function ChannelList() {
  const [view, setView] = useState('newChannel');
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [addedMembers, setAddedMembers] = useState([]);
  const dispatch = useDispatch();
  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center overflow-auto bg-bg-primary p-4 text-white sm:p-6">
      {view == 'newChannel' && (
        <div className="flex min-h-screen w-full flex-col items-center p-4 text-text-primary sm:p-6">
          <div className="w-full bg-bg-primary">
            <div className="mb-4 flex w-full items-center justify-between sm:mb-6">
              <button
                data-test-id="new-channel-view"
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
              <h2 className="mr-5 text-xl font-semibold text-text-primary">
                New Channel
              </h2>
              <div></div>
            </div>

            <div className="mb-4 flex w-full flex-col items-center sm:mb-6">
              <div className="relative">
                {/* <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FF6347] text-2xl text-text-primary sm:h-24 sm:w-24 sm:text-3xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1 text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 19l6.364-6.364a1 1 0 011.414 0l2.121 2.121a1 1 0 01-1.414 1.414L11 16l-4 1 1-4z"
                    />
                  </svg>
                </button> 
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  data-test-id="add-story-file-input"
                />*/}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label
                  className="block text-sm text-text-primary"
                  htmlFor="channelName"
                >
                  Enter Channel Name
                </label>
                <input
                  data-test-id="channel-name-input"
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
                  placeholder="Channel Name"
                  aria-label="ChannelName"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-text-primary"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  data-test-id="description-input"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
                  placeholder="Description"
                  aria-label="Description"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'addMembers' && (
        <div className="relative w-full flex-col text-text-primary">
          <div className="w-full bg-bg-primary">
            <div className="mb-4 flex w-full items-center justify-between">
              <button
                data-test-id="add-members-view"
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
              <h2 className="mr-12 text-xl font-semibold text-text-primary">
                {channelName}
              </h2>
            </div>
            <AddUsersList
              addedMembers={addedMembers}
              setAddedMembers={setAddedMembers}
            />
          </div>
        </div>
      )}
      <div
        className="absolute bottom-8 right-8 flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-bg-button text-2xl hover:bg-bg-button-hover"
        onClick={() => {
          if (view === 'newChannel') setView('addMembers');
          else if (view === 'addMembers') dispatch(setcurrentMenu('ChatList'));
        }}
        data-test-id="create-button"
      >
        <FaAngleRight className="text-text-primary opacity-70" />
      </div>
    </div>
  );
}

export default ChannelList;
