import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import CallButtons from '../components/home/voicecall/CallButtons';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';

// Mock Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Create a mock Redux store
const mockStore = {
  call: {
    callState: 'no call',
  },
};

describe('CallButtons Component', () => {
  const mockHandleAccept = jest.fn();
  const mockHandleDecline = jest.fn();
  const mockHandleEndCall = jest.fn();
  const mockToggleMute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockImplementation((selector) => {
      return { callState: 'incoming call' }; // Default state
    });

    // Suppress console errors and warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('renders Decline and Accept buttons for incoming calls', () => {
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Decline')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
  });

  test('calls handleAccept and handleDecline when respective buttons are clicked', () => {
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Decline'));
    expect(mockHandleDecline).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Accept'));
    expect(mockHandleAccept).toHaveBeenCalledTimes(1);
  });

  test('renders End Call and Mute buttons during an ongoing call', () => {
    useSelector.mockImplementation(() => ({ callState: 'in call' }));

    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('End Call')).toBeInTheDocument();
    expect(screen.getByTestId('mute-button')).toBeInTheDocument();
  });

  test('calls toggleMute and handleEndCall when respective buttons are clicked', () => {
    useSelector.mockImplementation(() => ({ callState: 'in call' }));

    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('mute-button'));
    expect(mockToggleMute).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('End Call'));
    expect(mockHandleEndCall).toHaveBeenCalledTimes(1);
  });

  test('shows correct mute button state based on isMute prop', () => {
    useSelector.mockImplementation(() => ({ callState: 'in call' }));

    const { rerender } = render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mute-button')).toHaveClass('bg-gray-200');

    rerender(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <CallButtons
            handleAccept={mockHandleAccept}
            handleDecline={mockHandleDecline}
            handleEndCall={mockHandleEndCall}
            toggleMute={mockToggleMute}
            isMute={false}
          />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mute-button')).toHaveClass('bg-gray-200');
  });
});
