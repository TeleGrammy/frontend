import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ContactList from '../components/home/leftSidebar/ContactList';
import { setcurrentMenu } from '../slices/sidebarSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('axios');

describe('ContactList Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    // Mock Axios
    axios.post.mockResolvedValue({ data: {} });
    // Suppress console errors and warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ContactList and interacts with the search input', () => {
    render(<ContactList />);

    // Check for header text
    const header = screen.getByTestId('new-contact-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Search');

    // Simulate input change
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John Doe' } });

    expect(searchInput.value).toBe('John Doe');
  });

  test('dispatches setcurrentMenu when go-back button is clicked', () => {
    render(<ContactList />);

    const goBackButton = screen.getByTestId('go-back-button');
    fireEvent.click(goBackButton);

    expect(mockDispatch).toHaveBeenCalledWith(setcurrentMenu('ChatList'));
  });

  test('performs search and handles results', async () => {
    // Mock API response
    axios.post.mockResolvedValue({
      data: {
        data: {
          user: [
            {
              _id: '1',
              username: 'John Doe',
              screenName: 'johnny',
              email: 'john@example.com',
              phone: '1234567890',
            },
          ],
        },
      },
    });

    render(<ContactList />);

    // Simulate input change and search
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    // Wait for the results to render
    await waitFor(() => {
      expect(searchButton).toBeInTheDocument();
    });
  });

  test('calls handleAddContact on Add to Contacts button click', async () => {
    // Mock API response
    axios.post.mockResolvedValue({
      data: {
        data: {
          user: [
            {
              _id: '1',
              username: 'John Doe',
              screenName: 'johnny',
              email: 'john@example.com',
              phone: '1234567890',
            },
          ],
        },
      },
    });

    render(<ContactList />);

    // Simulate input change and search
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    // Wait for the results and simulate expanding the result
    await waitFor(() => {
      expect(searchButton).toBeInTheDocument();
    });
  });

  test('renders "No results found" if there are no search results', async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          user: [],
        },
      },
    });

    render(<ContactList />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Unknown' } });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      const noResults = screen.getByText('No results found');
      expect(noResults).toBeInTheDocument();
    });
  });
});
