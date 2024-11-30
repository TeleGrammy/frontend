import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpForm from '../components/registration/SignUpForm';
import { MemoryRouter } from 'react-router-dom';

// Mock the RobotVerification component
jest.mock('../components/registration/RobotVerification', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      reset: jest.fn(), // Mock the reset method
    }));
    return (
      <div
        data-testid="captcha"
        onClick={() => {
          props.setVerification({ type: 'captchaVerified', payload: true });
        }}
      >
        Mocked Captcha
      </div>
    );
  });
});

// Mock the fetch API
global.fetch = jest.fn();

describe('SignUpForm Component', () => {
  const mockSetVerificationEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks for fresh state
    jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress warnings
  });

  test('renders the SignUpForm component', () => {
    render(
      <MemoryRouter>
        <SignUpForm setVerificationEmail={mockSetVerificationEmail} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('captcha')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <SignUpForm setVerificationEmail={mockSetVerificationEmail} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password321' },
    });

    fireEvent.blur(screen.getByTestId('confirm-password-input'));

    expect(
      await screen.findByText("Passwords aren't matched."),
    ).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    render(
      <MemoryRouter>
        <SignUpForm setVerificationEmail={mockSetVerificationEmail} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone-input'), {
      target: { value: '01234567890' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('captcha'));
    fireEvent.click(screen.getByTestId('sign-up-button'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(mockSetVerificationEmail).toHaveBeenCalledWith(
      'testuser@example.com',
    );
  });

  test('displays error when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Something went wrong!'));

    render(
      <MemoryRouter>
        <SignUpForm setVerificationEmail={mockSetVerificationEmail} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone-input'), {
      target: { value: '01234567890' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('captcha'));
    fireEvent.click(screen.getByTestId('sign-up-button'));

    await waitFor(() =>
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument(),
    );
  });
});
