import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';

jest.mock('react-router-dom', () => {
  const actualRouter = jest.requireActual('react-router-dom');
  return {
    ...actualRouter,
    useNavigate: jest.fn(), // Mock the useNavigate hook
  };
});

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

describe('ResetPassword Component', () => {
  const mockNavigate = jest.fn();

  function renderWithRouter(component, { route = '/reset-password/sample-token' } = {}) {
    window.history.pushState({}, 'Test page', route); // Set the route explicitly
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} /> {/* Root route for completeness */}
          <Route path="/reset-password/:token" element={component} />
        </Routes>
      </BrowserRouter>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  test('renders the ResetPassword component', () => {
    renderWithRouter(<ResetPassword />, { route: '/reset-password/sample-token' }); 

    expect(screen.getByText(/Set Your New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('handles password input change', () => {
    renderWithRouter(<ResetPassword />, { route: '/reset-password/sample-token' }); 

    const passwordInput = screen.getByLabelText(/New Password/i);
    fireEvent.change(passwordInput, { target: { value: 'new-password' } });
    expect(passwordInput).toHaveValue('new-password');
  });

  test('handles confirm password input change', () => {
    renderWithRouter(<ResetPassword />, { route: '/reset-password/sample-token' }); 

    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'new-password' } });
    expect(confirmPasswordInput).toHaveValue('new-password');
  });

  test('shows error message if passwords do not match', async () => {
    renderWithRouter(<ResetPassword />, { route: '/reset-password/sample-token' });

    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('submits the form successfully if passwords match', async () => {
    const { useNavigate } = require('react-router-dom'); // Get the mocked useNavigate
    useNavigate.mockImplementation(() => mockNavigate); // Implement the mocked navigation

    renderWithRouter(<ResetPassword />, { route: '/reset-password/sample-token' }); 

    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(passwordInput, { target: { value: 'matching-password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'matching-password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/'); // Check navigation
    });
  });

  afterAll(() => {
    // Cleanup fetch mock
    global.fetch.mockRestore();
  });
});
