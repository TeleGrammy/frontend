import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import EmailVerification from '../components/registration/EmailVerification';

// Mock navigate and fetch
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe('EmailVerification Component', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders correctly and submit button is disabled initially', () => {
    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('enables submit button when all code inputs are filled', () => {
    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index + 1 } });
    });

    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  test('submits the code and navigates on success', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index + 1 } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
  });

  test('shows error message if verification fails', async () => {
    // Mock failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'Invalid verification code.',
      }),
    });

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index + 1 } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Invalid verification code/i),
      ).toBeInTheDocument(),
    );
  });

  test('displays "An error occurred" if a network error occurs', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index + 1 } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred while verifying the code/i),
      ).toBeInTheDocument(),
    );
  });

  test('resends the verification code successfully', async () => {
    // Mock successful resend response
    fetch.mockResolvedValueOnce({
      ok: true,
    });

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const resendButton = screen.getByTestId('resend-code-button');
    fireEvent.click(resendButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Verification code resent successfully/i),
      ).toBeInTheDocument(),
    );
  });

  test('shows error message if resend fails', async () => {
    // Mock failed resend response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'User not found or already verified.',
      }),
      status: 404,
    });

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const resendButton = screen.getByTestId('resend-code-button');
    fireEvent.click(resendButton);

    await waitFor(() =>
      expect(
        screen.getByText(/User not found or already verified/i),
      ).toBeInTheDocument(),
    );
  });

  test('shows "An error occurred" if a network error occurs during resend', async () => {
    // Mock network error during resend
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <EmailVerification email={mockEmail} />
      </MemoryRouter>,
    );

    const resendButton = screen.getByTestId('resend-code-button');
    fireEvent.click(resendButton);

    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred while resending the code/i),
      ).toBeInTheDocument(),
    );
  });
});
