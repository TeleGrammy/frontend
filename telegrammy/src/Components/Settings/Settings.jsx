import React, { useState, useEffect } from 'react';
import Edit from './Edit';
import PrivacySettings from './PrivacySettings';
import { useDispatch } from "react-redux";
import { setcurrentMenu } from '../../slices/sidebarSlice'


const Settings = () => {
  const [view, setView] = useState('settings');

  const [name, setName] = useState(() => localStorage.getItem('name') || 'Mohamed');
  const [bio, setBio] = useState(() => localStorage.getItem('bio') || 'This is my bio');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'mohamed123');
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture') || null);
  const [email, setEmail] = useState(() => localStorage.getItem('email') || 'user@example.com');
  const [phone, setPhone] = useState(() => localStorage.getItem('phone') || '+1 (123) 456-7890');

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('bio', bio);
  }, [bio]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    if (profilePicture) {
      localStorage.setItem('profilePicture', profilePicture);
    } else {
      localStorage.removeItem('profilePicture');
    }
  }, [profilePicture]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  const deriveInitials = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
    const secondInitial = nameParts[1]?.[0]?.toUpperCase() || '';
    return firstInitial + secondInitial;
  };
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setcurrentMenu('ChatList'));
};

  const initials = deriveInitials(name);

  return (
    <div className="bg-bg-primary text-white min-h-screen w-full flex flex-col items-center p-4 sm:p-6 overflow-auto no-scrollbar">
      {view === 'settings' && (
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="flex items-center justify-between sm:py-4">
          <button
            onClick={() => handleClick()}
            className="text-[#A9A9A9] hover:text-gray-300"
            aria-label="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
            <h2 className="text-xl sm:text-2xl font-semibold ml-6 text-text-primary">Settings</h2>

            <button
              className="text-[#FF6347] hover:text-[#FF4500] flex items-center"
              onClick={() => setView('edit')}
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 19l6.364-6.364a1 1 0 011.414 0l2.121 2.121a1 1 0 01-1.414 1.414L11 16l-4 1 1-4z" />
              </svg>
              Edit
            </button>
          </div>

          <div className="flex flex-col items-center my-4 sm:my-6">
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FF6347] rounded-full h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center text-2xl sm:text-3xl overflow-hidden">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <p className="text-base sm:text-lg mt-2 text-text-primary">{name}</p>
            <p className="text-base sm:text-lg mt-1 text-text-primary">@{username}</p>
            <p className="text-base sm:text-lg mt-1 text-text-primary">{email}</p>
            <p className="text-base sm:text-lg mt-1 text-text-primary">{phone}</p>
            <p className="text-[#A9A9A9]">online</p>
          </div>
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-base sm:text-lg mt-4">{bio || 'No bio available'}</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <button
              className="w-full text-left px-3 py-2 sm:px-4 sm:py-3 bg-bg-secondary text-text-primary rounded-lg flex items-center hover:bg-bg-hover transition duration-200"
              onClick={() => setView('privacy')}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#A9A9A9] mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-8v6m-6 8v6" />
              </svg>
              Privacy and Security
            </button>
          </div>
        </div>
      )}
      {view === 'edit' && (
        <Edit
          name={name}
          setName={setName}
          bio={bio}
          setBio={setBio}
          username={username}
          setUsername={setUsername}
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          setView={setView}
        />
      )}
      {view === 'privacy' && <PrivacySettings setView={setView} />}
    </div>
  );
};

export default Settings; 