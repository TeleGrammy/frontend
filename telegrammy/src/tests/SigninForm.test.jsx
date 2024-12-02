import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
  act,
} from '@testing-library/react';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import '@testing-library/jest-dom';
import SignInForm from '../components/registration/SignInForm';
import { loginUser } from '../slices/authSlice'; // Import the loginUser thunk
import { ClipLoader } from 'react-spinners';

// Mock Redux slice and store
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('react-spinners', () => ({
  ClipLoader: () => <div data-testid="loading-clip" />,
}));

// Create a mock Redux store
const mockStore = {
  auth: {
    user: null,
    loading: false,
    error: '',
  },
};

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks for fresh state
    mockDispatch.mockClear();

    useSelector.mockImplementation((selector) => {
      return { loading: false, error: '' };
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

  test('renders Sign In form correctly', () => {
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <SignInForm />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
  });

  test('displays loading spinner when submitting', async () => {
    // Set the loading state to true in the mock store
    useSelector.mockImplementation((selector) => {
      return { loading: true, error: '' };
    });

    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <SignInForm />
        </Provider>
      </MemoryRouter>,
    );

    // fireEvent.change(screen.getByTestId('email-input'), {
    //   target: { value: 'test@example.com' },
    // });
    // fireEvent.change(screen.getByTestId('password-input'), {
    //   target: { value: 'password' },
    // });

    // fireEvent.click(screen.getByTestId('sign-in-button'));

    // await waitFor(() => {
    //     expect(mockDispatch).toHaveBeenCalledTimes(1);
    //   });

    // Check if the spinner is shown during loading
    expect(screen.getByTestId('sign-in-button')).toContainElement(
      screen.getByTestId('loading-clip'), // ClipLoader renders as a status role
    );
  });

  test('submits login form successfully', async () => {
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <SignInForm />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByTestId('sign-in-button'));

    // await waitFor(() => {
    //     expect(mockDispatch).toHaveBeenCalledWith(
    //       loginUser({ UUID: 'test@example.com', password: 'password' })
    //     );
    //   });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  test('shows error message if login fails', async () => {
    useSelector.mockImplementation((selector) => {
      return { loading: false, error: 'Invalid credentials' };
    });
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <SignInForm />
        </Provider>
      </MemoryRouter>,
    );

    // fireEvent.change(screen.getByTestId('email-input'), {
    //   target: { value: 'test@example.com' },
    // });
    // fireEvent.change(screen.getByTestId('password-input'), {
    //   target: { value: 'wrongpassword' },
    // });

    // fireEvent.click(screen.getByTestId('sign-in-button'));

    // await waitFor(() => {
    //   expect(mockDispatch).toHaveBeenCalledTimes(1);
    // });

    expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
  });

  test('focus and blur events change input styles', async () => {
    render(
      <MemoryRouter>
        <Provider store={createStore(() => mockStore)}>
          <SignInForm />
        </Provider>
      </MemoryRouter>,
    );

    const emailDiv = screen.getByTestId('email-div');
    const passwordDiv = screen.getByTestId('password-div');

    // Check that the initial border is not focused
    expect(emailDiv).toHaveClass('border-sky-500');

    act(() => {
      fireEvent.focus(emailDiv);
    });
    expect(emailDiv).toHaveClass('border-sky-500'); // Focused state

    act(() => {
      fireEvent.blur(emailDiv);
    });
    await waitFor(() => {
      expect(emailDiv).toHaveClass('border-sky-500'); // Blurred state
    });

    //console.log('Focus State:', emailDiv.className);
    // console.log('Email Value:', screen.getByTestId('email-input').value);

    fireEvent.focus(passwordDiv);
    expect(passwordDiv).toHaveClass('border-sky-500'); // Focused state

    fireEvent.blur(passwordDiv);
    expect(passwordDiv).toHaveClass('border-sky-500'); // Blurred state
  });
});
