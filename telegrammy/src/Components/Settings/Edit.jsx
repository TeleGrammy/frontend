import React, { useState, useEffect } from 'react';

const Edit = ({
  name,
  setName,
  bio,
  setBio,
  username,
  setUsername,
  profilePicture,
  setProfilePicture,
  email,
  setEmail,
  phone,
  setPhone,
  setView,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bioText, setBioText] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (name) {
      const nameParts = name.trim().split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts[1] || '');
    }
    setBioText(bio || '');
    setCurrentUsername(username || '');
    setCurrentEmail(email || '');
    setCurrentPhone(phone || '');
    setPreview(profilePicture || null);
  }, [name, bio, username, email, phone, profilePicture]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(profilePicture);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, profilePicture]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(String(phone));
  };

  const handleSave = () => {
    let hasError = false;

    if (!firstName.trim()) {
      setError('First name is required.');
      hasError = true;
    } else {
      setError('');
    }

    if (!currentUsername.trim()) {
      setUsernameError('Username is required.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!validateEmail(currentEmail)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!validatePhone(currentPhone)) {
      setPhoneError('Please enter a valid phone number.');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) {
      return;
    }

    setName(`${firstName} ${lastName}`.trim());
    setBio(bioText);
    setUsername(currentUsername);
    setEmail(currentEmail);
    setPhone(currentPhone);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setView('settings');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setView('settings');
    }
  };

  const deriveInitials = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
    const secondInitial = nameParts[1]?.[0]?.toUpperCase() || '';
    return firstInitial + secondInitial;
  };

  const initials = deriveInitials(`${firstName} ${lastName}`);

  return (
    <div className="w-full text-text-primary min-h-screen flex flex-col items-center p-4 sm:p-6">
      <div className="w-full bg-bg-primary">
        <div className="w-full flex justify-between items-center mb-4 sm:mb-6">
          <button
            onClick={() => setView('settings')}
            className="text-text-primary hover:text-gray-300"
            aria-label="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold mr-5 text-text-primary">Edit Profile</h2>
          <div></div>
        </div>

        <div className="flex flex-col items-center mb-4 sm:mb-6 w-full">
          <div className="relative">
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FF6347] rounded-full h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center text-2xl sm:text-3xl overflow-hidden text-text-primary">
              {preview ? (
                <img src={preview} alt="Profile Preview" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-white text-black rounded-full p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 19l6.364-6.364a1 1 0 011.414 0l2.121 2.121a1 1 0 01-1.414 1.414L11 16l-4 1 1-4z" />
              </svg>
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm text-text-primary" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              placeholder="Enter your first name"
              aria-label="First Name"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-primary" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              placeholder="Enter your last name"
              aria-label="Last Name"
            />
          </div>

          <div>
            <label className="block text-sm text-text-primary" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              placeholder="Enter your username"
              aria-label="Username"
            />
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-primary" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                if (validateEmail(e.target.value)) {
                  setEmailError('');
                }
              }}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              placeholder="Enter your email"
              aria-label="Email"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-primary" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={currentPhone}
              onChange={(e) => {
                setCurrentPhone(e.target.value);
                if (validatePhone(e.target.value)) {
                  setPhoneError('');
                }
              }}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              placeholder="+1 (123) 456-7890"
              aria-label="Phone Number"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-primary" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-bg-secondary rounded-lg text-text-primary"
              rows="4"
              placeholder="Tell us about yourself..."
              aria-label="Bio"
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#FF6347] hover:bg-[#FF4500] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg mt-4 sm:mt-6"
          aria-label="Save Changes"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Edit; 