import React, { useEffect, useReducer } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
const initialState = {
  email: '',
  error: '',
  message: '',
  loading: false,
  disable: false,
  timer: 0,
  resendDisable: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'decrementTimer':
      return { ...state, timer: state.timer - 1 };
    case 'timerReset':
      return { ...state, timer: 60 };
    case 'disable':
      return { ...state, disable: action.payload };
    case 'message':
      return { ...state, message: action.payload };
    case 'resendDisable':
      return { ...state, resendDisable: action.payload };
  }
}
const ForgetPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEmailChange = (e) => {
    dispatch({ type: 'email', payload: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'error', payload: '' });

    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(`${apiUrl}/v1/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        dispatch({
          type: 'error',
          payload: data.message,
        });
      } else {
        dispatch({ type: 'message', payload: 'Please check your email.' });
      }

      dispatch({ type: 'disable', payload: true });
      dispatch({ type: 'timerReset' });
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };

  const handleResendToken = async (e) => {
    e.preventDefault();

    dispatch({ type: 'error', payload: '' });

    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(`${apiUrl}/v1/auth/reset-password/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
        }),
      });
      if (!response.ok) {
        dispatch({
          type: 'message',
          payload: '',
        });

        dispatch({
          type: 'error',
          payload: 'Internal server error, please try again later.',
        });
      } else {
        dispatch({ type: 'message', payload: 'the message is resent.' });
      }

      dispatch({ type: 'resendDisable', payload: true });
      dispatch({ type: 'timerReset' });
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };

  useEffect(() => {
    if (state.resendDisable && state.timer > 0) {
      const countdown = setInterval(() => {
        dispatch({ type: 'decrementTimer' });
      }, 1000);

      if (state.timer === 1) {
        dispatch({ type: 'resendDisable', payload: false });
        dispatch({ type: 'error', payload: '' });
        dispatch({ type: 'message', payload: '' });
        clearInterval(countdown);
      }

      return () => clearInterval(countdown);
    }
    return undefined;
  }, [state.resendDisable, state.timer]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Find your account
        </h2>
        <p className="text-center text-sm text-gray-600">
          Please enter your email to search for your account
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
            className={`w-full rounded-md ${state.loading ? 'bg-sky-800' : state.disable ? 'cursor-not-allowed bg-gray-400' : 'bg-sky-950'} px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-sky-800`}
            disabled={state.disable}
            name="search"
          >
            Search
          </button>

          {state.resendDisable && state.disable ? (
            <p className="text-center text-sm text-gray-600">
              You can research for your email again in {state.timer}
            </p>
          ) : (
            ''
          )}
        </form>
        {state.error && (
          <p className="mt-4 text-center text-red-600">{state.error}</p>
        )}
        {state.message !== '' ? (
          <p className="mt-4 text-center text-green-600">{state.message}</p>
        ) : (
          ''
        )}
        <div className="flex items-center justify-center space-x-2">
          <p className="text-center text-sm text-gray-600">
            Didn&apos;t receive a message?
          </p>
          <button
            className={`text-blue-500 ${
              state.resendDisable
                ? 'cursor-not-allowed opacity-50'
                : 'hover:underline'
            }`}
            onClick={handleResendToken}
            disabled={state.resendDisable}
            name="Resend Message"
          >
            {state.resendDisable && state.disable
              ? `Resend Message (${state.timer}s)`
              : 'Resend Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
