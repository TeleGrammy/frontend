import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ForgetPassword from '../pages/ForgetPassword';

// Mock the fetch function globally
global.fetch = jest.fn();

describe('ForgetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Use fake timers

    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Mock fetch response based on input email
    fetch.mockImplementation((url, options) => {
      const { body } = options;
      const parsedBody = JSON.parse(body);

      if (parsedBody.email === 'notfound@example.com') {
        // Mock response for an email that does not exist
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Email does not exist.' }),
        });
      } else if (parsedBody.email === 'elroshdy23@gmail.com') {
        // Mock response for a successful email submission
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Please check your email.' }),
        });
      }
      // Default mock response
      return Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid email format.' }),
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked console methods
  });

  const renderForgetPassword = () => {
    return render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>,
    );
  };

  test('renders the ForgetPassword component', () => {
    renderForgetPassword();
    expect(screen.getByText(/Find your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Resend Message/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Resend Message/i }),
    ).toBeDisabled();
  });

  test('updates email field', () => {
    renderForgetPassword();
    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('handles invalid email format', () => {
    renderForgetPassword();
    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    expect(searchButton).not.toBeDisabled();
  });

  test('handles correct email format but email does not exist', async () => {
    renderForgetPassword();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'notfound@example.com' } });

    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/forget-password'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'notfound@example.com' }),
        }),
      );
      expect(screen.getByText(/Email does not exist./i)).toBeInTheDocument();
    });
  });

  test('successfully submits with valid email', async () => {
    renderForgetPassword();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'elroshdy23@gmail.com' } });

    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/forget-password'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'elroshdy23@gmail.com' }),
        }),
      );
      expect(screen.getByText(/Please check your email./i)).toBeInTheDocument();
    });
  });
});
