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
      console.log('File selected:', e.target.files[0]);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(String(phone));
  };

  const handleUpdate = async () => {
    const hasProfileChanged =
      currentUsername !== username ||
      bioText !== bio ||
      fullName.trim() !== name ||
      currentPhone !== phone;
    const hasEmailChanged = currentEmail !== email;

    // Handle profile information update
    if (hasProfileChanged) {
      try {
        const updatedData = {
          username: currentUsername,
          bio: bioText,
          screenName: fullName.trim(),
          status: 'active',
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
          setUsernameError('Username already taken.');
          setStay(true);
        } else {
          const result = await response.json();
          console.log('User info updated successfully:', result);
        }
      } catch (error) {
        console.error('Error updating profile info:', error);
        setStay(true);
      }
    }

    // Handle email update
    if (hasEmailChanged) {
      try {
        const updatedData = {
          email: currentEmail,
        };
        console.log(JSON.stringify(updatedData));
        const emailResponse = await fetch(`${apiUrl}/v1/user/profile/email`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedData),
        });

        if (!emailResponse.ok) {
          setEmailError('Failed to update email.');
          setStay(true);
        } else {
          const emailResult = await emailResponse.json();
          console.log('Email updated successfully:', emailResult);
        }
      } catch (error) {
        console.error('Error updating email:', error);
        setStay(true);
      }
    }

    // Handle profile picture update
    if (selectedFile) {
      try {
        console.log(selectedFile);
        const formData = new FormData();
        const dataUrl = URL.createObjectURL(selectedFile);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        formData.append('picture', blob, selectedFile.name);

        const pictureResponse = await fetch(
          `${apiUrl}/v1/user/profile/picture/`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
          },
        );

        if (!pictureResponse.ok) {
          console.error('Failed to update profile picture.');
          setStay(true);
        } else {
          const pictureResult = await pictureResponse.json();
          console.log('Profile picture updated successfully:', pictureResult);
          setProfilePicture(pictureResult.data.user.picture); // Assuming the response contains the URL of the uploaded picture
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        setStay(true);
      }
    }
  };

  const handleSave = () => {
    let hasError = false;

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

    setName(fullName.trim());
    setBio(bioText);
    setUsername(currentUsername);
    setPhone(currentPhone);
    handleUpdate();

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoURL = reader.result; // Get the Data URL

        setPath(photoURL); // Save it to the `path` state
        setProfilePicture(photoURL); // Save it to the `profilePicture` state

        if (!stay) {
          setView('settings');
        }
      };
      reader.readAsDataURL(selectedFile); // Read file as Data URL
    } else {
      if (!stay) {
        setView('settings');
      }
    }
  };

  const deriveInitials = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
    const secondInitial = nameParts[1]?.[0]?.toUpperCase() || '';
    return firstInitial + secondInitial;
  };

  const initials = deriveInitials(fullName);

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4 text-text-primary sm:p-6">
      <div className="w-full bg-bg-primary">
        <div className="mb-4 flex w-full items-center justify-between sm:mb-6">
          {/* Back Button */}
          <button
            data-test-id="settings-view"
            onClick={() => setView('settings')}
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
          {/* Title */}
          <h2
            data-test-id="edit-profile-title"
            className="mr-5 text-xl font-semibold text-text-primary"
          >
            Edit Profile
          </h2>
          <div></div>
        </div>

        <div className="mb-4 flex w-full flex-col items-center sm:mb-6">
          <div className="relative">
            {/* Profile Picture */}
            <div
              data-test-id="profile-picture"
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FF6347] text-2xl text-text-primary sm:h-24 sm:w-24 sm:text-3xl"
            >
              {preview ? (
                <img
                  data-test-id="profile-preview"
                  src={preview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {/* Upload Button */}
            <button
              data-test-id="upload-button"
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
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label
              className="block text-sm text-text-primary"
              htmlFor="fullName"
              data-test-id="full-name-label"
            >
              Full Name
            </label>
            <input
              data-test-id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
              placeholder="Enter your full name"
              aria-label="Full Name"
            />
            {error && (
              <p
                data-test-id="full-name-error"
                className="mt-1 text-sm text-red-500"
              >
                {error}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              className="block text-sm text-text-primary"
              htmlFor="username"
              data-test-id="username-label"
            >
              Username
            </label>
            <input
              data-test-id="user-name"
              type="text"
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
              placeholder="Enter your username"
              aria-label="Username"
            />
            {usernameError && (
              <p
                data-test-id="username-error"
                className="mt-1 text-sm text-red-500"
              >
                {usernameError}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm text-text-primary"
              htmlFor="email"
              data-test-id="email-label"
            >
              Email
            </label>
            <input
              data-test-id="email"
              type="email"
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                if (validateEmail(e.target.value)) {
                  setEmailError('');
                }
              }}
              className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
              placeholder="Enter your email"
              aria-label="Email"
            />
            {emailError && (
              <p
                data-test-id="email-error"
                className="mt-1 text-sm text-red-500"
              >
                {emailError}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block text-sm text-text-primary"
              htmlFor="phone"
              data-test-id="phone-label"
            >
              Phone Number
            </label>
            <input
              data-test-id="phone"
              id="phone"
              type="tel"
              value={currentPhone}
              onChange={(e) => {
                setCurrentPhone(e.target.value);
                if (validatePhone(e.target.value)) {
                  setPhoneError('');
                }
              }}
              className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
              placeholder="+1 (123) 456-7890"
              aria-label="Phone Number"
            />
            {phoneError && (
              <p
                data-test-id="phone-error"
                className="mt-1 text-sm text-red-500"
              >
                {phoneError}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label
              className="block text-sm text-text-primary"
              htmlFor="bio"
              data-test-id="bio-label"
            >
              Bio
            </label>
            <textarea
              data-test-id="bio"
              id="bio"
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full rounded-lg bg-bg-secondary px-3 py-2 text-text-primary sm:px-4 sm:py-2"
              rows="4"
              placeholder="Tell us about yourself..."
              aria-label="Bio"
            ></textarea>
          </div>
        </div>

        {/* Save Button */}
        <button
          data-test-id="save"
          onClick={handleSave}
          className="mt-4 w-full rounded-lg bg-[#FF6347] px-3 py-2 text-white hover:bg-[#FF4500] sm:mt-6 sm:px-4 sm:py-2"
          aria-label="Save Changes"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Edit;
