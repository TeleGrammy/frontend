import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { useSocket } from '../contexts/SocketContext';
import { useCallContext } from '../contexts/CallContext';
import Caller from '../components/home/voicecall/Caller';

jest.mock('../contexts/SocketContext', () => ({
  useSocket: jest.fn(),
}));

jest.mock('../contexts/CallContext', () => ({
  useCallContext: jest.fn(),
}));

describe('Caller Component', () => {
  const mockStore = configureStore([]);
  let store;
  let mockSocket;
  let mockCallContext;

  const mockUser = { _id: 'mockUserId' };
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify(mockUser);
    }
    return null;
  });

  beforeEach(() => {
    mockSocket = {
      current: {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      },
    };

    global.MediaStream = jest.fn(() => ({
      addTrack: jest.fn(),
      getTracks: jest.fn(() => []),
    }));

    // You can also mock `navigator.mediaDevices.getUserMedia`
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
    };

    mockCallContext = {
      endCallFromCallerRef: { current: null },
      muteRef: { current: null },
    };

    useSocket.mockReturnValue({ socketGeneralRef: mockSocket });
    useCallContext.mockReturnValue(mockCallContext);

    store = mockStore({
      call: {
        callState: 'no call',
        callID: null,
        chatId: null,
      },
      chats: {
        openedChat: {
          _id: '12345',
        },
      },
    });
    // Suppress console errors and warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the call button', () => {
    render(
      <Provider store={store}>
        <Caller />
      </Provider>,
    );

    const callButton = screen.getByTestId('call-button');
    expect(callButton).toBeInTheDocument();
  });

  test('creates a call on button click', () => {
    render(
      <Provider store={store}>
        <Caller />
      </Provider>,
    );

    const callButton = screen.getByTestId('call-button', { hidden: true });
    fireEvent.click(callButton);

    expect(mockSocket.current.emit).toHaveBeenCalledTimes(1);
  });

  test('handles incoming ICE candidates', () => {
    render(
      <Provider store={store}>
        <Caller />
      </Provider>,
    );

    const iceCandidates = [{ candidate: 'mockCandidate' }];
    const mockResponse = { senderId: 'user123', iceCandidates };

    // Simulate receiving added ICE event
    const incomingICEHandler = mockSocket.current.on.mock.calls.find(
      ([eventName]) => eventName === 'call:addedICE',
    )[1];
    incomingICEHandler(mockResponse);

    // Expect ICE candidate handling
    expect(mockSocket.current.on).toHaveBeenCalledWith(
      'call:addedICE',
      expect.any(Function),
    );
  });

  test('cleans up on component unmount', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Caller />
      </Provider>,
    );

    unmount();

    expect(mockSocket.current.off).toHaveBeenCalledWith(
      'call:incomingAnswer',
      expect.any(Function),
    );
    expect(mockSocket.current.off).toHaveBeenCalledWith(
      'call:rejectedCall',
      expect.any(Function),
    );
    expect(mockSocket.current.off).toHaveBeenCalledWith(
      'call:addedICE',
      expect.any(Function),
    );
    expect(mockSocket.current.off).toHaveBeenCalledWith(
      'call:endedCall',
      expect.any(Function),
    );
  });
});
