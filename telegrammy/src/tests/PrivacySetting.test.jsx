import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import PrivacySettings from '../components/Settings/PrivacySettings'; // Import your component
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument

// Mock the fetch calls to simulate the API responses
global.fetch = jest.fn();

describe('PrivacySettings Component', () => {
  const mockSetView = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    mockSetView.mockClear();

    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the PrivacySettings form with the correct initial values', () => {
    render(<PrivacySettings setView={mockSetView} />);

    // Check if the initial visibility settings are correct
    expect(screen.getByTestId('profile-picture-visibility').value).toBe(
      'EveryOne',
    );
    expect(screen.getByTestId('stories-visibility').value).toBe('EveryOne');
    expect(screen.getByTestId('last-seen-visibility').value).toBe('EveryOne');
    expect(screen.getByTestId('group-add-permission').value).toBe('EveryOne');
    expect(screen.getByTestId('read-receipts-checkbox')).toBeChecked();
  });

  it('handles visibility settings change', async () => {
    render(<PrivacySettings setView={mockSetView} />);

    // Change profile picture visibility
    fireEvent.change(screen.getByTestId('profile-picture-visibility'), {
      target: { value: 'Contacts' },
    });

    // Wait for the visibility setting to be updated
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/privacy/settings/profile-visibility'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            profilePicture: 'Contacts',
            stories: 'EveryOne',
            lastSeen: 'EveryOne',
          }),
        }),
      );
    });
  });

  it('handles blocking and unblocking users', async () => {
    render(<PrivacySettings setView={mockSetView} />);

    await waitFor(() => {
      expect(screen.getByTestId('no-blocked-users')).toBeInTheDocument();
    });

    // Mock fetch for blocking user
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    // Block a user
    fireEvent.change(screen.getByTestId('block-user-input'), {
      target: { value: 'testuser' },
    });
    fireEvent.keyDown(screen.getByTestId('block-user-input'), { key: 'Enter' });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/privacy/settings/blocking-status/block'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ userId: 'testuser' }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('blocked-user-0')).toBeInTheDocument();
    });

    // Mock fetch for unblocking user
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    // Unblock the user
    fireEvent.click(screen.getByTestId('unblock-user-0'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/privacy/settings/blocking-status/unblock'),
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ userName: 'testuser' }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('no-blocked-users')).toBeInTheDocument();
    });
  });

  it('handles read receipts toggle', async () => {
    render(<PrivacySettings setView={mockSetView} />);

    // Toggle read receipts
    fireEvent.click(screen.getByTestId('read-receipts-checkbox'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/privacy/settings/read-receipts'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ isEnabled: false }),
        }),
      );
    });
  });

  it('handles group add permission change', async () => {
    render(<PrivacySettings setView={mockSetView} />);

    // Change group add permission
    fireEvent.change(screen.getByTestId('group-add-permission'), {
      target: { value: 'Admins' },
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/privacy/settings/group-control'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ newPolicy: 'Admins' }),
        }),
      );
    });
  });

  it('handles back button click', () => {
    render(<PrivacySettings setView={mockSetView} />);

    fireEvent.click(screen.getByTestId('privacy-go-back'));

    expect(mockSetView).toHaveBeenCalledWith('settings');
  });
});
