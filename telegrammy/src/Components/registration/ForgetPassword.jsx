import React, { useState, useReducer } from 'react';

const initialState = {
  email: '',
  error: '',
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    case 'loading':
      return { ...state, loading: action.payload };
  }
}
const ResetPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEmailChange = (e) => {

    dispatch({ type: 'email', payload: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'error', payload: '' });

    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/forget-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: state.email,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response.status);
    //   setVerificationEmail(state.email);
    //   navigate('/signup/verify');
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-600">
          Enter your email to receive a verification code
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={state.email}
              onChange={handleEmailChange}
              required
              className="mt-1 w-full rounded-lg border-2 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              placeholder="Email"
            />
          </div>
          <button
            type="submit"
            className={`w-full rounded-md ${state.loading ? 'bg-sky-800' : 'bg-sky-950'} px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-sky-800`}
          >
            Send Verification Code
          </button>
        </form>
        {state.message && <p className="mt-4 text-center text-gray-600">{state.message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
