// GroupSettings.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GroupSettings from '../components/home/chat/GroupSettings'; // Adjust the import path
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument

// Mock the fetch calls to simulate the API responses
global.fetch = jest.fn();

// Mocks for useSocket and useSelector
const mockSocketGroupRef = {
  current: {
    on: jest.fn(),
    emit: jest.fn(),
  },
};

jest.mock('../contexts/SocketContext', () => ({
  useSocket: () => ({ socketGroupRef: mockSocketGroupRef }),
}));

const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: () => mockUseSelector(),
}));

describe('GroupSettings Component', () => {
  const mockSetGroupPhoto = jest.fn();
  const mockSetGroupDescription = jest.fn();
  const mockSetGroupSizeLimit = jest.fn();
  const mockSetGroupPrivacy = jest.fn();
  const mockSetGroupName = jest.fn();
  const mockToggleView = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    mockSetGroupPhoto.mockClear();
    mockSetGroupDescription.mockClear();
    mockSetGroupSizeLimit.mockClear();
    mockSetGroupPrivacy.mockClear();
    mockSetGroupName.mockClear();
    mockSocketGroupRef.current.on.mockClear();
    mockSocketGroupRef.current.emit.mockClear();
    mockToggleView.mockClear();
    mockUseSelector.mockClear();

    global.URL.createObjectURL = jest.fn(() => 'mockedObjectUrl');
    global.URL.revokeObjectURL = jest.fn();

    // Suppress console warnings and errors
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

  it('renders the GroupSettings component with correct initial values', () => {
    mockUseSelector.mockReturnValue({ openedChat: { groupId: 'groupId123' } });

    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    // Assert initial values
    expect(screen.getByAltText(/Group/i).src).toContain('path/to/group.jpg');
    expect(screen.getByTestId('name-input').value).toBe('Group Name');
    expect(screen.getByTestId('description-input').value).toBe(
      'This is a group.',
    );
    expect(screen.getByTestId('privacy-select').value).toBe('Public');
    expect(screen.getByTestId('size-limit-input').value).toBe('50');
  });

  it('handles photo change', async () => {
    const file = new File(['file'], 'group.jpg', { type: 'image/jpeg' });
    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    const selectPhotoButton = screen.getByTestId('select-photo-button');
    fireEvent.click(selectPhotoButton);

    const fileInput = screen.getByTestId('photo-input');
    expect(fileInput).toBeInTheDocument();

    await waitFor(() => {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });
      fireEvent.change(fileInput);
    });

    await waitFor(() => {
      expect(mockSetGroupPhoto).toHaveBeenCalled();
    });
  });

  it('handles description and name change', () => {
    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    const nameInput = screen.getByTestId('name-input');
    const descriptionInput = screen.getByTestId('description-input');

    fireEvent.change(nameInput, { target: { value: 'New Group Name' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'New group description.' },
    });

    expect(nameInput.value).toBe('New Group Name');
    expect(descriptionInput.value).toBe('New group description.');
  });

  it('handles privacy and size limit change', () => {
    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    const privacySelect = screen.getByTestId('privacy-select');
    const sizeLimitInput = screen.getByTestId('size-limit-input');

    fireEvent.change(privacySelect, { target: { value: 'Private' } });
    fireEvent.change(sizeLimitInput, { target: { value: '100' } });

    expect(privacySelect.value).toBe('Private');
    expect(sizeLimitInput.value).toBe('100');
  });

  it('saves changes when Save Changes button is clicked', async () => {
    mockUseSelector.mockReturnValue({ openedChat: { groupId: 'groupId123' } });

    // Mock fetch responses for profile picture and group info update
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ signedUrl: 'new/path/to/group.jpg' }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: {} }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: {} }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: {} }),
        }),
      );

    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    // Simulate changes
    const nameInput = screen.getByTestId('name-input');
    const descriptionInput = screen.getByTestId('description-input');
    const privacySelect = screen.getByTestId('privacy-select');
    const sizeLimitInput = screen.getByTestId('size-limit-input');

    fireEvent.change(nameInput, { target: { value: 'New Group Name' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'New group description.' },
    });
    fireEvent.change(privacySelect, { target: { value: 'Private' } });
    fireEvent.change(sizeLimitInput, { target: { value: '100' } });

    const saveButton = screen.getByTestId('save-changes-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Check if fetch was called the expected number of times
      expect(fetch).toHaveBeenCalled();

      // Ensure the set functions were called
      expect(mockSetGroupDescription).toHaveBeenCalledWith(
        'New group description.',
      );
      expect(mockSetGroupName).toHaveBeenCalledWith('New Group Name');
      expect(mockSetGroupPrivacy).toHaveBeenCalledWith('Private');
      expect(mockSetGroupSizeLimit).toHaveBeenCalledWith('100');
    });
  });

  it('deletes group when Delete Group button is clicked', () => {
    mockUseSelector.mockReturnValue({ openedChat: { groupId: 'groupId123' } });

    render(
      <GroupSettings
        groupId="groupId123"
        groupPhoto="path/to/group.jpg"
        groupDescription="This is a group."
        setGroupPhoto={mockSetGroupPhoto}
        setGroupDescription={mockSetGroupDescription}
        isAdmin={true}
        groupSizeLimit={50}
        setGroupSizeLimit={mockSetGroupSizeLimit}
        groupPrivacy="Public"
        setGroupPrivacy={mockSetGroupPrivacy}
        groupName="Group Name"
        setGroupName={mockSetGroupName}
        isOwner={true}
        toggleView={mockToggleView}
      />,
    );

    const deleteButton = screen.getByTestId('delete-group-button');
    fireEvent.click(deleteButton);

    expect(mockSocketGroupRef.current.emit).toHaveBeenCalledWith(
      'removingGroup',
      { groupId: 'groupId123' },
    );
  });
});