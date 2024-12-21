import React, { useReducer } from 'react';
import SocialLogin from './SocialLogin';
import UserNameIcon from '../icons/UserNameIcon';
import EmailIcon from '../icons/EmailIcon';
import PhoneNumberIcon from '../icons/PhoneNumberIcon';
import PasswordIcon from '../icons/PasswordIcon';
import ShowPasswordIcon from '../icons/ShowPasswordIcon';
import HidePasswordIcon from '../icons/HidePasswordIcon';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../slices/authSlice'; // Import the loginUser thunk

const initialState = {
  showPassword: false,
  email: '',
  focusOnEmail: -1,
  password: '',
  focusOnPassword: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'togglePass':
      return { ...state, showPassword: !state.showPassword };
    case 'email':
      return { ...state, email: action.payload };
    case 'focusEmail':
      return { ...state, focusOnEmail: action.payload };
    case 'password':
      return { ...state, password: action.payload };
    case 'focusPass':
      return { ...state, focusOnPassword: action.payload };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    default:
      throw new Error('Unknown');
  }
}

const SignInForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const notificationToken = localStorage.getItem('notificationToken');
    reduxDispatch(
      loginUser({
        UUID: state.email,
        password: state.password,
        token: notificationToken,
      }),
    );
  };

  return (
    <div className="w-full p-6 md:w-1/2 md:p-7">
      <h2 className="mb-6 text-2xl font-semibold text-gray-700 md:mb-8">
        Sign In
      </h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmitForm}>
        {/* Email */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnEmail) === 1
                ? 'border-sky-500'
                : state.email === ''
                  ? 'border-red-500'
                  : 'border-green-400'
            } mt-2 rounded-md`}
          >
            <EmailIcon />
            <input
              id="email"
              type="email"
              data-test-id="email-input" // Added data-test-id
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onFocus={() => dispatch({ type: 'focusEmail', payload: 1 })}
              onBlur={() => dispatch({ type: 'focusEmail', payload: 0 })}
              onChange={(e) =>
                dispatch({ type: 'email', payload: e.target.value })
              }
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnPassword) === 1
                ? 'border-sky-500'
                : state.password === ''
                  ? 'border-red-500'
                  : 'border-green-400'
            } relative mt-2 rounded-md`}
          >
            <PasswordIcon />
            <input
              id="password"
              type={state.showPassword ? 'text' : 'password'}
              data-test-id="password-input" // Added data-test-id
              className="flex-1 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              onChange={(e) =>
                dispatch({ type: 'password', payload: e.target.value })
              }
              onFocus={() => dispatch({ type: 'focusPass', payload: 1 })}
              onBlur={() => dispatch({ type: 'focusPass', payload: 0 })}
            />
            <button
              id="show-hide-password"
              type="button"
              data-test-id="toggle-password-visibility" // Added data-test-id
              onClick={() => dispatch({ type: 'togglePass' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform focus:outline-none"
            >
              {state.showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          </div>
        </div>

        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-end">
          <Link
            to="/auth/forget-password"
            data-test-id="forgot-password-link" // Added data-test-id
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        {/* Sign In Button */}
        <button
          type="submit"
          id="sign-in"
          data-test-id="sign-in-button" // Added data-test-id
          disabled={loading}
          className={`w-full rounded-md ${loading ? 'bg-sky-800' : 'bg-sky-950'} px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-sky-800`}
        >
          {loading ? (
            <ClipLoader color="#ffffff" size={20} /> // Render the spinner when loading
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <SocialLogin />
    </div>
  );
};

export default SignInForm;
