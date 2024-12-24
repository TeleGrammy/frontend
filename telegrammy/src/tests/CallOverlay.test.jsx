import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import '@testing-library/jest-dom';
import { useSocket } from '../contexts/SocketContext';
import { useCallContext } from '../contexts//CallContext';
import CallOverlay from '../components/home/voicecall/CallOverlay';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock('../contexts/SocketContext', () => ({
  useSocket: jest.fn(),
}));
jest.mock('../contexts//CallContext', () => ({
  useCallContext: jest.fn(),
}));

describe('CallOverlay Component', () => {
  let mockDispatch;
  let socketMock;
  let callContextMock;
  let localAudioRef;
  let remoteAudioRef;

  beforeEach(() => {
    const mockUser = { _id: 'mockUserId' };
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    global.MediaStream = jest.fn(() => ({
      addTrack: jest.fn(),
      getTracks: jest.fn(() => []),
    }));

    // You can also mock `navigator.mediaDevices.getUserMedia`
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
    };

    // Mock socket and context
    socketMock = {
      current: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    };
    callContextMock = {
      endCallFromCallerRef: { current: { click: jest.fn() } },
      muteRef: { current: { click: jest.fn() } },
    };

    useSocket.mockReturnValue({ socketGeneralRef: socketMock });
    useCallContext.mockReturnValue(callContextMock);

    // Mock refs
    localAudioRef = { current: { srcObject: null } };
    remoteAudioRef = { current: { srcObject: null } };

    // Mock useDispatch and useSelector
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        call: {
          participants: [],
          callState: 'no call',
          callTime: '00:00',
          isCallOverlayOpen: true,
          chatId: null,
          callID: null,
          isMute: false,
        },
      }),
    );
    // Suppress console errors and warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders call overlay when isCallOverlayOpen is true', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        call: {
          participants: [],
          callState: 'incoming',
          callTime: '00:00',
          isCallOverlayOpen: true,
          chatId: {
            isGroup: false,
            participants: [
              {
                userId: { _id: 'user123', username: 'John Doe', picture: null },
              },
            ],
          },
          callID: 'call123',
          isMute: false,
        },
      }),
    );

    render(
      <CallOverlay
        localAudioRef={localAudioRef}
        remoteAudioRef={remoteAudioRef}
      />,
    );

    const callerName = screen.getByText('John Doe');
    expect(callerName).toBeInTheDocument();
  });

  test('does not render when callState is "no call"', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        call: {
          participants: [],
          callState: 'no call',
          callTime: '00:00',
          isCallOverlayOpen: false,
          chatId: null,
          callID: null,
          isMute: false,
        },
      }),
    );

    render(
      <CallOverlay
        localAudioRef={localAudioRef}
        remoteAudioRef={remoteAudioRef}
      />,
    );

    const overlay = screen.queryByTestId('close-call-overlay-button');
    expect(overlay).not.toBeInTheDocument();
  });

  test('calls handleCloseOverlay on close button click', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        call: {
          participants: [],
          callState: 'incoming',
          callTime: '00:00',
          isCallOverlayOpen: true,
          chatId: null,
          callID: null,
          isMute: false,
        },
      }),
    );

    render(
      <CallOverlay
        localAudioRef={localAudioRef}
        remoteAudioRef={remoteAudioRef}
      />,
    );

    const closeButton = screen.getByTestId('close-call-overlay-button');
    fireEvent.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'call/closeOverlay' });
  });
});
