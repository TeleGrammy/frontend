import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Edit from '../components/Settings/Edit'; // Import your component
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument

// Mock the fetch calls to simulate the API responses
global.fetch = jest.fn();

describe('Edit Component', () => {
  const mockSetView = jest.fn();
  const mockSetName = jest.fn();
  const mockSetBio = jest.fn();
  const mockSetUsername = jest.fn();
  const mockSetProfilePicture = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPhone = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    mockSetView.mockClear();
    mockSetName.mockClear();
    mockSetBio.mockClear();
    mockSetUsername.mockClear();
    mockSetProfilePicture.mockClear();
    mockSetEmail.mockClear();
    mockSetPhone.mockClear();

    global.URL.createObjectURL = jest.fn(() => 'mockedObjectUrl');
    global.URL.revokeObjectURL = jest.fn();

    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // Clean up the mock after tests
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  it('renders the Edit form with the correct initial values', () => {
    render(
      <Edit
        name="John Doe"
        setName={mockSetName}
        bio="Developer"
        setBio={mockSetBio}
        username="johndoe"
        setUsername={mockSetUsername}
        profilePicture="path/to/profile.jpg"
        setProfilePicture={mockSetProfilePicture}
        email="john@example.com"
        setEmail={mockSetEmail}
        phone="123-456-7890"
        setPhone={mockSetPhone}
        setView={mockSetView}
      />,
    );

    // Check if fields are populated with initial values
    expect(screen.getByLabelText(/Full Name/i).value).toBe('John Doe');
    expect(screen.getByLabelText(/Username/i).value).toBe('johndoe');
    expect(screen.getByLabelText(/Email/i).value).toBe('john@example.com');
    expect(screen.getByLabelText(/Phone Number/i).value).toBe('123-456-7890');
    expect(screen.getByLabelText(/Bio/i).value).toBe('Developer');
    expect(screen.getByAltText(/Profile Preview/i).src).toContain(
      'path/to/profile.jpg',
    );
  });

  it('displays error when the form is submitted with invalid data', async () => {
    render(
      <Edit
        name=""
        setName={mockSetName}
        bio=""
        setBio={mockSetBio}
        username=""
        setUsername={mockSetUsername}
        profilePicture=""
        setProfilePicture={mockSetProfilePicture}
        email="invalid-email"
        setEmail={mockSetEmail}
        phone="1234a"
        setPhone={mockSetPhone}
        setView={mockSetView}
      />,
    );

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      // Validate that error messages appear for invalid input
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter a valid email address/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please enter a valid phone number.'),
      ).toBeInTheDocument();
    });
  });

  it('submits the form successfully when valid data is provided', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ data: { user: { picture: 'new/profile.jpg' } } }),
    });

    render(
      <Edit
        name="John Doe"
        setName={mockSetName}
        bio="Developer"
        setBio={mockSetBio}
        username="johndoe"
        setUsername={mockSetUsername}
        profilePicture="path/to/profile.jpg"
        setProfilePicture={mockSetProfilePicture}
        email="john@example.com"
        setEmail={mockSetEmail}
        phone="9876543210"
        setPhone={mockSetPhone}
        setView={mockSetView}
      />,
    );

    // Update inputs
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'janedoe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'janee@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: 'Designer' },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      // Check if the data was submitted correctly
      expect(fetch).toHaveBeenCalledTimes(2);

      // Ensure set functions were called
      expect(mockSetName).toHaveBeenCalledWith('Jane Doe');
      expect(mockSetUsername).toHaveBeenCalledWith('janedoe');
      //   expect(mockSetEmail).toHaveBeenCalledWith('janee@example.com');
      expect(mockSetPhone).toHaveBeenCalledWith('9876543210');
    });
  });

  it('handles file input change and updates preview', async () => {
    const file = new File(['file'], 'test.jpg', { type: 'image/jpeg' });
    render(
      <Edit
        name="John Doe"
        setName={mockSetName}
        bio="Developer"
        setBio={mockSetBio}
        username="johndoe"
        setUsername={mockSetUsername}
        profilePicture="path/to/profile.jpg"
        setProfilePicture={mockSetProfilePicture}
        email="john@example.com"
        setEmail={mockSetEmail}
        phone="123-456-7890"
        setPhone={mockSetPhone}
        setView={mockSetView}
      />,
    );

    // Simulate file upload
    fireEvent.change(screen.getByTestId('add-story-file-input'), {
      target: { files: [file] },
    });

    await waitFor(() => {
      // Check if preview has been updated
      expect(URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(URL.createObjectURL).toHaveReturnedWith('mockedObjectUrl');
    });
  });

  it('handles back button click', () => {
    render(
      <Edit
        name="John Doe"
        setName={mockSetName}
        bio="Developer"
        setBio={mockSetBio}
        username="johndoe"
        setUsername={mockSetUsername}
        profilePicture="path/to/profile.jpg"
        setProfilePicture={mockSetProfilePicture}
        email="john@example.com"
        setEmail={mockSetEmail}
        phone="123-456-7890"
        setPhone={mockSetPhone}
        setView={mockSetView}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Go Back/i));

    expect(mockSetView).toHaveBeenCalledWith('settings');
  });
});
