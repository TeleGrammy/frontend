import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GroupOrChannelInfo from '../components/home/chat/GroupOrChannelInfo';
import '@testing-library/jest-dom';

jest.mock('../components/home/chat/GroupSettings', () => () => <div data-testid="group-settings-component" />);
jest.mock('../components/home/leftSidebar/AddUsersList', () => () => <div data-testid="add-users-list-component" />);
jest.mock('../components/home/rightSidebar/CloseButton', () => () => <div data-testid="close-button-component" />);
jest.mock('../components/home/rightSidebar/SelectedInfo', () => () => <div data-testid="selected-info-component" />);
jest.mock('../components/home/leftSidebar/Header', () => ({ children }) => <div data-testid="header-component">{children}</div>);

const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: () => mockUseSelector(),
}));

const mockSocketGroupRef = {
  current: {
    on: jest.fn(),
    emit: jest.fn(),
  },
};
jest.mock('../contexts/SocketContext', () => ({
  useSocket: () => ({ socketGroupRef: mockSocketGroupRef }),
}));

global.fetch = jest.fn();

describe('GroupOrChannelInfo components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockUseSelector.mockClear();

    const localStorageMock = (function () {
      let store = {
        user: JSON.stringify({ _id: 'user123' }),
      };
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    global.importMeta = { env: { VITE_API_URL: 'http://localhost' } };
  });

  it('renders loading indicator when loading', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: { photo: 'groupPhoto.jpg', groupId: 'groupId123' },
    });

    render(<GroupOrChannelInfo />);

    expect(await screen.findByTestId('loader')).toBeInTheDocument();
  });

  it('renders group info correctly after loading', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: { photo: 'groupPhoto.jpg', groupId: 'groupId123', isGroup: true, isChannel: false },
    });

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            members: [
              { id: 'member1', username: 'User1' },
              { id: 'member2', username: 'User2' },
            ],
          },
        }),
      })
    );

    render(<GroupOrChannelInfo />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
  });

  it('toggles view to edit mode when Edit button is clicked', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: { photo: 'groupPhoto.jpg', groupId: 'groupId123', isGroup: true, isChannel: false },
    });

    render(<GroupOrChannelInfo />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByTestId('group-settings-component')).toBeInTheDocument();
  });

  it('allows admin to make a member an admin', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: { photo: 'groupPhoto.jpg', groupId: 'groupId123', isGroup: true, isChannel: false },
    });

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            members: [
              { id: 'member1', username: 'User1' },
            ],
          },
        }),
      })
    );

    render(<GroupOrChannelInfo />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const makeAdminButton = screen.getByText('Make Admin');
    fireEvent.click(makeAdminButton);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/groups/groupId123/admins/member1'),
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('filters members based on search query', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: { photo: 'groupPhoto.jpg', groupId: 'groupId123', isGroup: true, isChannel: false },
    });

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            members: [
              { id: 'member1', username: 'Alice' },
              { id: 'member2', username: 'Bob' },
              { id: 'member3', username: 'Charlie' },
            ],
          },
        }),
      })
    );

    render(<GroupOrChannelInfo />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'bo' } });

    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('allows adding new members', async () => {
    mockUseSelector.mockReturnValue({
      openedChat: {
        photo: 'groupPhoto.jpg',
        groupId: 'groupId123',
        isGroup: true,
        isChannel: false,
      },
    });

    // Mock fetch to return members
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            members: [
              { id: 'member1', username: 'User1' },
              { id: 'member2', username: 'User2' },
            ],
          },
        }),
      })
    );

    render(<GroupOrChannelInfo />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Simulate the action that would show the Add Users List
    const addButton = screen.getByText('Add Users'); // Adjust this if needed
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-users-list-component')).toBeInTheDocument();
  });
});