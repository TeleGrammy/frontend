import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Settings from '../components/Settings/Settings';

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

global.fetch = jest.fn();

describe('Settings Component', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders correctly and shows loading spinner initially', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('settings')).toBeInTheDocument(),
    );

    // Additional assertions after loading
    expect(screen.getByTestId('edit-settings')).toBeInTheDocument();
    expect(screen.getByTestId('privacy')).toBeInTheDocument();
  });

  test('displays user data after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          user: {
            screenName: 'John Doe',
            bio: 'Test bio',
            username: 'johndoe',
            email: 'johndoe@example.com',
            phone: '123-456-7890',
            picture: '',
          },
        },
      }),
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Test bio')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
      expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    });
  });

  test('handles failed data fetch gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user data:',
        expect.any(Error),
      );
    });
  });

  test('navigates to edit view when Edit button is clicked', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('edit-settings')).toBeInTheDocument(),
    );

    const editButton = screen.getByTestId('edit-settings');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });
  });

  test('navigates to privacy view when Privacy button is clicked', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('privacy')).toBeInTheDocument(),
    );

    const privacyButton = screen.getByTestId('privacy');
    fireEvent.click(privacyButton);

    await waitFor(() => {
      expect(screen.getByText(/Privacy settings/i)).toBeInTheDocument();
    });
  });

  test('toggles auto-download and updates slider state', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('auto-download')).toBeInTheDocument(),
    );

    const checkbox = screen.getByTestId('auto-download');
    const slider = screen.getByRole('slider');

    expect(checkbox).not.toBeChecked();
    expect(slider).toBeDisabled();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
      expect(slider).toBeEnabled();
    });
  });

  test('updates file size slider value', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('auto-download')).toBeInTheDocument(),
    );

    const checkbox = screen.getByTestId('auto-download');
    const slider = screen.getByRole('slider');

    fireEvent.click(checkbox); // Enable slider

    await waitFor(() => {
      fireEvent.change(slider, { target: { value: '1024' } });
      expect(slider.value).toBe('1024');
    });
  });

  test('dispatches Redux action on back button click', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming the spinner uses 'role="status"'

    // Wait for the loading state to finish and elements to appear
    await waitFor(() =>
      expect(screen.getByTestId('settings')).toBeInTheDocument(),
    );

    const backButton = screen.getByTestId('settings');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sidebar/setcurrentMenu',
        payload: 'ChatList',
      });
    });
  });
});
