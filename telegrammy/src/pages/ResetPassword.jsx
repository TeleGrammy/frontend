import React, { useReducer } from 'react';
import ShowPasswordIcon from '../components/icons/ShowPasswordIcon';
import HidePasswordIcon from '../components/icons/HidePasswordIcon';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const initialState = {
  password: '',
  confirmPassword: '',
  error: '',
  showPassword: false,
  showConfirmPassword: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setPassword':
      return { ...state, password: action.payload };
    case 'setConfirmPassword':
      return { ...state, confirmPassword: action.payload };
    case 'setError':
      return { ...state, error: action.payload };
    case 'togglePass':
      return { ...state, showPassword: !state.showPassword };
    case 'toggleConfirmPass':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    default:
      return state;
  }
}

function ResetPassword() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      dispatch({ type: 'setError', payload: 'Passwords do not match.' });
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/v1/auth/reset-password/${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: state.password,
            passwordConfirm: state.confirmPassword,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        dispatch({ type: 'setError', payload: data.message });
        return;
      }
      dispatch({ type: 'setError', payload: '' });
      navigate('/');
    } catch (error) {
      dispatch({
        type: 'setError',
        payload: 'An error occurred. Please try again later.',
      });
      return;
    }

    // if (state.password !== state.confirmPassword) {
    //   dispatch({ type: 'setError', payload: 'Passwords do not match.' });
    // } else {
    //   dispatch({ type: 'setError', payload: '' });
    //   navigate('/');
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Set Your New Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <label className="mb-1 block text-gray-700" htmlFor="password">
              New Password
            </label>
            <input
              type={state.showPassword ? 'text' : 'password'}
              id="password"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: 'setPassword', payload: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
              data-testid="password-input"
            />
            <button
              id="show-hide-password"
              type="button"
              onClick={() => dispatch({ type: 'togglePass' })}
              className="-translate-y-1/8 absolute right-2 top-1/2 transform focus:outline-none"
              data-testid="toggle-password-visibility-button"
            >
              {state.showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          </div>
          <div className="relative mb-4">
            <label
              className="mb-1 block text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type={state.showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={state.confirmPassword}
              onChange={(e) =>
                dispatch({
                  type: 'setConfirmPassword',
                  payload: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
              data-testid="confirm-password-input"
            />
            <button
              id="show-hide-confirm-password"
              type="button"
              onClick={() => dispatch({ type: 'toggleConfirmPass' })}
              className="-translate-y-1/8 absolute right-2 top-1/2 transform focus:outline-none"
              data-testid="toggle-confirm-password-visibility-button"
            >
              {state.showConfirmPassword ? (
                <ShowPasswordIcon />
              ) : (
                <HidePasswordIcon />
              )}
            </button>
          </div>
          {state.error && (
            <p className="mb-4 text-red-500" data-testid="error-message">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-sky-950 px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-sky-800"
            data-testid="submit-button"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
