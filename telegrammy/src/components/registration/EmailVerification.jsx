import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const initialState = {
  code: new Array(6).fill(''),
  isResendDisabled: false,
  timer: 0,
  error: '',
  success: false,
  resendMessage: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'code':
      return {
        ...state,
        code: state.code.map((digit, idx) =>
          idx === action.payload.index ? action.payload.value : digit,
        ),
      };
    case 'resend':
      return { ...state, isResendDisabled: action.payload };
    case 'timer':
      return { ...state, timer: action.payload };
    case 'decrementTimer':
      return { ...state, timer: state.timer - 1 };
    case 'error':
      return { ...state, error: action.payload };
    case 'success':
      return { ...state, success: action.payload };
    case 'resendMessage':
      return { ...state, resendMessage: action.payload };
  }
}

const EmailVerification = ({ email }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const Email = email;

  // Function to handle changes in each code input field
  const handleCodeChange = (element, index) => {
    const value = element.value;
    if (isNaN(value) || value.length > 1) {
      return;
    } else {
      dispatch({
        type: 'code',
        payload: { index: index, value: value },
      });

      // Automatically focus on the next input box
      if (element.nextSibling && value) {
        element.nextSibling.focus();
      }
    }
  };

  // Check if all code inputs are filled
  const isCodeComplete = () => state.code.every((digit) => digit !== '');

  // responses errors handlers
  const handleVerifyError = (response) => {
    switch (response.status) {
      case 400:
        dispatch({ type: 'error', payload: 'Invalid verification code.' });
        break;
      case 404:
        dispatch({ type: 'error', payload: 'User not found.' });
        break;
      case 409:
        dispatch({
          type: 'error',
          payload: 'Conflict with existing user data.',
        });
        break;
      case 500:
        dispatch({ type: 'error', payload: 'Internal server error.' });
        break;
      default:
        dispatch({
          type: 'error',
          payload: 'Something went wrong. Please try again.',
        });
    }
  };

  const handleResendError = (response) => {
    switch (response.status) {
      case 400:
        dispatch({ type: 'error', payload: 'Missing required fields.' });
        break;
      case 404:
        dispatch({
          type: 'error',
          payload: 'User not found or already verified.',
        });
        break;
      case 500:
        dispatch({ type: 'error', payload: 'Internal server error.' });
        break;
      default:
        dispatch({
          type: 'error',
          payload: 'Something went wrong. Please try again.',
        });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = state.code.join('');

    if (!verificationCode) {
      dispatch({ type: 'error', payload: 'Verification code is required.' });
      return;
    }

    try {
      console.log(verificationCode);
      const response = await fetch(`${apiUrl}/v1/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      });

      console.log(email);

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'success', payload: true });
        dispatch({ type: 'error', payload: '' });
        console.log('Verification successful:', data);

        navigate('/login');
      } else {
        const data = await response.json();
        dispatch({ type: 'error', payload: data.message });
        dispatch({ type: 'success', payload: false });
      }
    } catch (error) {
      dispatch({
        type: 'error',
        payload: 'An error occurred while verifying the code.',
      });
      console.error('Error:', error);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      dispatch({
        type: 'resendMessage',
        payload: 'Email is required to resend verification code.',
      });
      return;
    }

    dispatch({ type: 'resend', payload: true });
    dispatch({ type: 'timer', payload: 30 });

    try {
      const response = await fetch(
        `${apiUrl}/v1/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        dispatch({
          type: 'resendMessage',
          payload: 'Verification code resent successfully.',
        });
      } else {
        handleResendError(response);
      }
    } catch (error) {
      dispatch({
        type: 'resendMessage',
        payload: 'An error occurred while resending the code.',
      });
      console.error('Error:', error);
    }

    dispatch({ type: 'timer', payload: 30 });
  };

  // Timer effect for countdown and enabling resend button
  useEffect(() => {
    if (state.isResendDisabled && state.timer > 0) {
      const countdown = setInterval(() => {
        dispatch({ type: 'decrementTimer' });
      }, 1000);

      if (state.timer === 1) {
        clearInterval(countdown);
        dispatch({ type: 'resend', payload: false });
      }

      console.log(isCodeComplete());

      return () => clearInterval(countdown);
    }
    return undefined;
  }, [state.isResendDisabled, state.timer]);

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-700 sm:text-2xl">
          Verify Your Email
        </h2>

        {state.error && (
          <p className="mb-4 text-center text-red-500">{state.error}</p>
        )}
        {state.success && (
          <p className="mb-4 text-center text-green-500">
            Verification successful!
          </p>
        )}
        {state.resendMessage && (
          <p className="mb-4 text-center text-blue-500">
            {state.resendMessage}
          </p>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-6 flex justify-center space-x-2 sm:space-x-3">
            {state.code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(e.target, index)}
                className="h-12 w-12 rounded-lg border border-blue-300 text-center text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-14 sm:w-14"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full rounded-lg px-4 py-2 font-bold text-white transition duration-200 ${
              isCodeComplete()
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'cursor-not-allowed bg-gray-400'
            }`} // Change background color based on button state
            disabled={!isCodeComplete()} // Disable button if code is not complete
          >
            Submit
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Didn&apos;t receive a code?{' '}
          <button
            className={`text-blue-500 ${
              state.isResendDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:underline'
            }`}
            onClick={handleResendCode}
            disabled={state.isResendDisabled}
          >
            {state.isResendDisabled
              ? `Resend Code (${state.timer}s)`
              : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
