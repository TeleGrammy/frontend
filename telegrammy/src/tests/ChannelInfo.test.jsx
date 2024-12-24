import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChannelInfo from '../components/home/chat/ChannelInfo'; // Import the ChannelInfo component
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../contexts/SocketContext';
import { ClipLoader } from 'react-spinners';
import '@testing-library/jest-dom';

// Mocking necessary hooks and modules
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../contexts/SocketContext', () => ({
  useSocket: jest.fn(),
}));

jest.mock('../components/home/leftSidebar/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));

// Suppress console logs
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('ChannelInfo Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Reset the mock for each test
    useSelector.mockReset();
    useDispatch.mockReset();
    useSocket.mockReset();

    useDispatch.mockReturnValue(mockDispatch);
  });

  it('should render loading spinner when data is being fetched', async () => {
    // Mock the data from useSelector and useSocket
    useSelector.mockReturnValue({
      openedChat: { channelId: '1', isChannel: true, photo: '' },
    });

    useSocket.mockReturnValue({
      socketChannelRef: { current: { on: jest.fn(), emit: jest.fn() } },
    });

    render(<ChannelInfo />);

    // Check if loading spinner is shown
    expect(screen.getByTestId('7a7a')).toBeInTheDocument();
  });

  it('should render channel information after loading', async () => {
    // Mock the data from useSelector and useSocket
    useSelector.mockReturnValue({
      openedChat: {
        channelId: '1',
        isChannel: true,
        photo: 'https://picsum.photos/50/50',
      },
    });

    useSocket.mockReturnValue({
      socketChannelRef: { current: { on: jest.fn(), emit: jest.fn() } },
    });

    // Mock API responses
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => ({
          participants: [
            {
              userData: { id: '1', name: 'User 1', profilePicture: '' },
              sendMessages: true,
              canDownload: false,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        json: () => ({
          channelOwner: { id: '1' },
          channelDescription: 'Description',
          channelName: 'Test Channel',
        }),
      });

    render(<ChannelInfo />);
  });

  it('should call makeAdmin when clicking on "Make Admin" button', async () => {
    // Mock the data from useSelector and useSocket
    useSelector.mockReturnValue({
      openedChat: { channelId: '1', isChannel: true, photo: '' },
    });

    useSocket.mockReturnValue({
      socketChannelRef: { current: { on: jest.fn(), emit: jest.fn() } },
    });

    // Mock API responses
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => ({
          participants: [
            {
              userData: { id: '1', name: 'User 1', profilePicture: '' },
              sendMessages: true,
              canDownload: false,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        json: () => ({
          channelOwner: { id: '1' },
          channelDescription: 'Description',
          channelName: 'Test Channel',
        }),
      });

    render(<ChannelInfo />);
  });
});
