import React, { useState, useEffect, useRef } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

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
  const [fullName, setFullName] = useState('');
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
  const [stay, setStay] = useState(false);
  const [path, setPath] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFullName(name || '');
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  const validatePhone = (phone) => /^\+?[1-9]\d{1,14}$/.test(String(phone));

  const handleUpdate = async () => {
    try {
      const updatedData = {
        username: currentUsername,
        bio: bioText,
        screenName: fullName.trim(),
        phone: currentPhone,
      };

      const response = await fetch(`${apiUrl}/v1/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        setUsernameError('Error updating profile.');
      } else {
        console.log('Profile updated successfully.');
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append('picture', selectedFile);

        const pictureResponse = await fetch(
          `${apiUrl}/v1/user/profile/picture/`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
          },
        );

        if (!pictureResponse.ok) {
          console.error('Error updating profile picture.');
        } else {
          const result = await pictureResponse.json();
          setProfilePicture(result.data.user.picture);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSave = () => {
    if (!currentUsername.trim()) {
      setUsernameError('Username is required.');
      return;
    }

    if (!validateEmail(currentEmail)) {
      setEmailError('Invalid email address.');
      return;
    }

    if (!validatePhone(currentPhone)) {
      setPhoneError('Invalid phone number.');
      return;
    }

    setName(fullName.trim());
    setBio(bioText);
    setUsername(currentUsername);
    setEmail(currentEmail);
    setPhone(currentPhone);

    handleUpdate();

    if (!stay) setView('settings');
  };

  const deriveInitials = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    return `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || ''}`.toUpperCase();
  };

  const initials = deriveInitials(fullName);

  return (
    <div
      data-test-id="edit-profile-page"
      className="flex min-h-screen flex-col items-center p-4 sm:p-6"
    >
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <button
            data-test-id="go-back-button"
            onClick={() => setView('settings')}
            className="text-primary"
          >
            Go Back
          </button>
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </div>
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <div
              data-test-id="profile-picture"
              className="h-24 w-24 overflow-hidden rounded-full"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0"
              data-test-id="edit-picture-button"
            >
              Edit
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            data-test-id="file-input"
          />
        </div>

        {/* Form fields */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
            data-test-id="name-input"
          />
          <textarea
            placeholder="Bio"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="input-field"
            data-test-id="bio-input"
          />
          <input
            type="text"
            placeholder="Username"
            value={currentUsername}
            onChange={(e) => setCurrentUsername(e.target.value)}
            className="input-field"
            data-test-id="username-input"
          />
          {usernameError && (
            <p data-test-id="username-error">{usernameError}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className="input-field"
            data-test-id="email-input"
          />
          {emailError && <p data-test-id="email-error">{emailError}</p>}
          <input
            type="tel"
            placeholder="Phone"
            value={currentPhone}
            onChange={(e) => setCurrentPhone(e.target.value)}
            className="input-field"
            data-test-id="phone-input"
          />
          {phoneError && <p data-test-id="phone-error">{phoneError}</p>}
        </div>

        <div className="flex w-full justify-end">
          <button
            onClick={handleSave}
            data-test-id="save-button"
            className="button-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
