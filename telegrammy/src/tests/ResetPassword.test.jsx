import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';

// Mock navigate and fetch
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ token: 'test-token' }),
}));

global.fetch = jest.fn();

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('shows error message if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Simulate entering mismatched passwords
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Passwords do not match.',
      ),
    );
  });

  test('submits the form and navigates successfully if passwords match', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Simulate entering matching passwords
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password1' } });
    fireEvent.click(submitButton);

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message if the backend returns an error', async () => {
    // Mock failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'Invalid token or request.',
      }),
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Simulate entering matching passwords
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password1' } });
    fireEvent.click(submitButton);

    // Check for backend error message
    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Invalid token or request.',
      ),
    );
  });

  test('displays "An error occurred" if a network error occurs', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Simulate entering matching passwords
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password1' } });
    fireEvent.click(submitButton);

    // Check for generic error message
    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'An error occurred. Please try again later.',
      ),
    );
  });
});
