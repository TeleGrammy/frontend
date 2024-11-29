import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../components/registration/SignUpForm';

// Mock child components and icons
jest.mock('../components/registration/SocialLogin', () => () => (
  <div>SocialLogin</div>
));
jest.mock(
  '../components/registration/RobotVerification',
  () =>
    ({ dispatch }) => (
      <button
        onClick={() => dispatch({ type: 'captchaVerified', payload: true })}
      >
        MockCaptcha
      </button>
    ),
);

jest.mock('src/components/icons/UserNameIcon', () => () => (
  <div>UserNameIcon</div>
));
jest.mock('src/components/icons/EmailIcon', () => () => <div>EmailIcon</div>);
jest.mock('src/components/icons/PhoneNumberIcon', () => () => (
  <div>PhoneNumberIcon</div>
));
jest.mock('src/components/icons/PasswordIcon', () => () => (
  <div>PasswordIcon</div>
));
jest.mock('src/components/icons/ShowPasswordIcon', () => () => (
  <div>ShowPasswordIcon</div>
));
jest.mock('src/components/icons/HidePasswordIcon', () => () => (
  <div>HidePasswordIcon</div>
));

global.fetch = jest.fn();

describe('SignUpForm Component', () => {
  const mockSetVerificationEmail = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the form correctly', () => {
    render(<SignUpForm setVerificationEmail={mockSetVerificationEmail} />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/SocialLogin/i)).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    render(<SignUpForm setVerificationEmail={mockSetVerificationEmail} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: '0123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'password123' },
    });

    // Simulate captcha verification
    fireEvent.click(screen.getByText(/MockCaptcha/i));

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Verify loading state
    expect(screen.getByText(/Sign Up/i)).toBeDisabled();

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockSetVerificationEmail).toHaveBeenCalledWith('test@example.com');
    });

    // Verify navigation (mocked)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/auth/register'),
      expect.any(Object),
    );
  });

  test('displays error if passwords do not match', () => {
    render(<SignUpForm setVerificationEmail={mockSetVerificationEmail} />);

    // Fill out mismatched passwords
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'differentpassword' },
    });

    // Blur confirm password input to trigger validation
    fireEvent.blur(screen.getByPlaceholderText(/Confirm Password/i));

    // Verify error message
    expect(screen.getByText(/Passwords aren't matched./i)).toBeInTheDocument();
  });

  test('shows error message when captcha is not verified', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Captcha not verified' }),
    });

    render(<SignUpForm setVerificationEmail={mockSetVerificationEmail} />);

    // Fill out the form without verifying captcha
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: '0123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Wait for error
    await waitFor(() => {
      expect(
        screen.getByText(/Please verify you are not a robot/i),
      ).toBeInTheDocument();
    });
  });
});
