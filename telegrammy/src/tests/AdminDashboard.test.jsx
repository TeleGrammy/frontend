import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard'; // Adjust the import path as needed
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument

// Mock the fetch calls to simulate API responses
global.fetch = jest.fn();

// Mocks for useDispatch and useNavigate
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

// Mock the react-redux and react-router-dom hooks
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the logout action
jest.mock('../slices/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'LOGOUT' })),
}));
import { logout } from '../slices/authSlice';

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    logout.mockClear();

    // Suppress console warnings and errors
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading indicators initially', () => {
    render(<AdminDashboard />);

    // Check if the loading indicators are present
    expect(screen.getByLabelText('Loading users')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading groups')).toBeInTheDocument();
  });

  it('renders registered users and available groups after loading', async () => {
    // Mock fetch responses
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  _id: '1',
                  username: 'User1',
                  email: 'user1@example.com',
                  status: 'active',
                },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  _id: '1',
                  name: 'Group1',
                  groupPermissions: { applyFilter: false },
                },
              ],
            }),
        })
      );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('Group1')).toBeInTheDocument();
    });
  });

  it('handles user status change', async () => {
    // Mock fetch responses for initial data
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  _id: '1',
                  username: 'User1',
                  email: 'user1@example.com',
                  status: 'active',
                },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: [] }), // Empty groups
        })
      );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('User1')).toBeInTheDocument();
    });

    // Mock the PATCH request for changing user status
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const banButton = screen.getByText('Ban');
    fireEvent.click(banButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/admins/users/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  it('handles group filter application', async () => {
    // Mock fetch responses for initial data
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: [] }), // Empty users
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  _id: '1',
                  name: 'Group1',
                  groupPermissions: { applyFilter: false },
                },
              ],
            }),
        })
      );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Group1')).toBeInTheDocument();
    });

    // Mock the PATCH request for applying the filter
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const applyFilterButton = screen.getByText(
      'Apply Inappropriate Content Filter'
    );
    fireEvent.click(applyFilterButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/admins/filter/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

});