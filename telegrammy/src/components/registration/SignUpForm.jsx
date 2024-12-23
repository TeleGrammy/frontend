import React, { useReducer, useRef } from 'react';
import SocialLogin from './SocialLogin';
import UserNameIcon from '../icons/UserNameIcon';
import EmailIcon from '../icons/EmailIcon';
import PhoneNumberIcon from '../icons/PhoneNumberIcon';
import PasswordIcon from '../icons/PasswordIcon';
import ShowPasswordIcon from '../icons/ShowPasswordIcon';
import HidePasswordIcon from '../icons/HidePasswordIcon';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import RobotVerification from './RobotVerification';

const apiUrl = import.meta.env.VITE_API_URL;
const initialState = {
  showPassword: false,
  showConfirmPassword: false,
  userName: '',
  focusOnUserName: -1,
  email: '',
  focusOnEmail: -1,
  phoneNumber: '',
  focusOnPhoneNumber: -1,
  password: '',
  focusOnPassword: -1,
  confirmPassword: '',
  focusOnConfirmPassword: -1,
  errorPasswordMatch: '',
  loading: false,
  error: '',
  captchaVerified: false,
  captchaToken: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'togglePass':
      return { ...state, showPassword: !state.showPassword };
    case 'toggleConfirmPass':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    case 'userName':
      return { ...state, userName: action.payload };
    case 'focusUserName':
      return { ...state, focusOnUserName: action.payload };
    case 'email':
      return { ...state, email: action.payload };
    case 'focusEmail':
      return { ...state, focusOnEmail: action.payload };
    case 'phoneNumber':
      return { ...state, phoneNumber: action.payload };
    case 'focusPhone':
      return { ...state, focusOnPhoneNumber: action.payload };
    case 'password':
      return { ...state, password: action.payload };
    case 'focusPass':
      return { ...state, focusOnPassword: action.payload };
    case 'confirmPassword':
      return { ...state, confirmPassword: action.payload };
    case 'focusConfirmPass':
      return { ...state, focusOnConfirmPassword: action.payload };
    case 'errorPasswordMatch':
      return { ...state, errorPasswordMatch: action.payload };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    case 'captchaVerified':
      return { ...state, captchaVerified: action.payload };
    case 'captchaToken':
      return { ...state, captchaToken: action.payload };
    default:
      throw new Error('Unknown');
  }
}

const SignUpForm = ({ setVerificationEmail }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const captchaRef = useRef(null); // Ref for the reCAPTCHA component
  const navigate = useNavigate();

  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.reset(); // Reset the reCAPTCHA widget
      dispatch({ type: 'captchaVerified', payload: false });
      dispatch({ type: 'captchaToken', payload: null });
    }
  };

  // const handlePasswordMatch = () => {
  //   console.log(state.password);
  //   console.log(state.confirmPassword);
  //   if (state.password !== state.confirmPassword) {
  //     dispatch({
  //       type: 'errorPasswordMatch',
  //       payload: "Passwords aren't matched.",
  //     });
  //   } else {
  //     dispatch({ type: 'errorPasswordMatch', payload: '' });
  //   }
  //   dispatch({ type: 'focusConfirmPass', payload: 0 });
  // };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    dispatch({ type: 'error', payload: '' });
    if (state.password !== state.confirmPassword) {
      dispatch({
        type: 'error',
        payload: "Passwords aren't matched.",
      });
      return;
    }
    if (!state.captchaVerified) {
      dispatch({ type: 'error', payload: 'Please verify you are not a robot' });
      return;
    }
    const phoneNumberWithCode = `+2${state.phoneNumber}`;

    try {
      dispatch({ type: 'loading', payload: true });
      console.log(state.captchaToken);
      const response = await fetch(`${apiUrl}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: state.userName,
          email: state.email,
          phone: phoneNumberWithCode,
          password: state.password,
          passwordConfirm: state.confirmPassword,
          token: state.captchaToken,
        }),
      });
      const data = await response.json();
      console.log(response);
      console.log(state.captchaToken);
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
      console.log(response.status);
      console.log('User registered successfully');
      setVerificationEmail(state.email);
      navigate('/auth/signup/verify');
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
      resetCaptcha();
    }
  };

  return (
    <div className="w-full p-6 md:w-1/2 md:p-7">
      <h2 className="mb-6 text-2xl font-semibold text-gray-700 md:mb-8">
        Sign Up
      </h2>
      {state.error && <div className="mb-4 text-red-500">{state.error}</div>}
      <form onSubmit={handleSubmitForm}>
        {/* Username */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnUserName) === 1
                ? 'border-sky-500'
                : state.userName === ''
                  ? 'border-red-500'
                  : 'border-green-400'
            } mt-2 rounded-md border-blue-300`}
          >
            <UserNameIcon />
            <input
              id="username"
              type="text"
              data-testid="username-input"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              onChange={(e) =>
                dispatch({ type: 'userName', payload: e.target.value })
              }
              onBlur={() => dispatch({ type: 'focusUserName', payload: 0 })}
              onFocus={() => dispatch({ type: 'focusUserName', payload: 1 })}
            />
          </div>
        </div>
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
              data-testid="email-input"
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
        {/* Phone Number */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnPhoneNumber) === 1
                ? 'border-sky-500'
                : state.phoneNumber === ''
                  ? 'border-red-500'
                  : 'border-green-400'
            } mt-2 rounded-md`}
          >
            <PhoneNumberIcon />
            <input
              id="phone"
              type="tel"
              data-testid="phone-input"
              pattern="01\d{9}"
              title="Phone number should be in the format 01XXXXXXXXX"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
              onChange={(e) =>
                dispatch({ type: 'phoneNumber', payload: e.target.value })
              }
              onFocus={() => dispatch({ type: 'focusPhone', payload: 1 })}
              onBlur={() => dispatch({ type: 'focusPhone', payload: 0 })}
            />
          </div>
        </div>
        {/* Password */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnPassword) === 1
                ? 'border-sky-500'
                : state.password === '' || state.errorPasswordMatch
                  ? 'border-red-500'
                  : 'border-green-400'
            } relative mt-2 rounded-md`}
          >
            <PasswordIcon />
            <input
              id="password"
              type={state.showPassword ? 'text' : 'password'}
              data-testid="password-input"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              onFocus={() => dispatch({ type: 'focusPass', payload: 1 })}
              onBlur={() => dispatch({ type: 'focusPass', payload: 0 })}
              onChange={(e) =>
                dispatch({ type: 'password', payload: e.target.value })
              }
            />
            <button
              type="button"
              data-testid="toggle-password-visibility-button"
              onClick={() => dispatch({ type: 'togglePass' })}
              className="absolute right-2"
            >
              {state.showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </button>
          </div>
        </div>
        {/* Confirm Password */}
        <div className="mb-4">
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnConfirmPassword) === 1
                ? 'border-sky-500'
                : state.confirmPassword === '' || state.errorPasswordMatch
                  ? 'border-red-500'
                  : 'border-green-400'
            } relative mt-2 rounded-md`}
          >
            <PasswordIcon />
            <input
              id="confirmPassword"
              type={state.showConfirmPassword ? 'text' : 'password'}
              data-testid="confirm-password-input"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              onFocus={() => dispatch({ type: 'focusConfirmPass', payload: 1 })}
              onBlur={() => dispatch({ type: 'focusConfirmPass', payload: 0 })}
              onChange={(e) => {
                dispatch({ type: 'confirmPassword', payload: e.target.value });
              }}
            />
            <button
              type="button"
              data-testid="toggle-confirm-password-visibility-button"
              onClick={() => dispatch({ type: 'toggleConfirmPass' })}
              className="absolute right-2"
            >
              {state.showConfirmPassword ? (
                <HidePasswordIcon />
              ) : (
                <ShowPasswordIcon />
              )}
            </button>
          </div>
          {state.errorPasswordMatch && (
            <p className="mt-1 text-sm text-red-500">
              {state.errorPasswordMatch}
            </p>
          )}
        </div>
        {/* Recaptcha */}
        <RobotVerification
          data-testid="captcha"
          captchaRef={captchaRef}
          dispatch={dispatch}
        />
        {/* Submit Button */}
        <button
          type="submit"
          data-testid="sign-up-button"
          disabled={state.loading}
          className={`mt-6 flex w-full items-center justify-center rounded-md border-2 border-blue-500 bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none ${
            state.loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {state.loading ? <ClipLoader color="#fff" size={20} /> : 'Sign Up'}
        </button>
        {/* Social Login */}
        <SocialLogin />
      </form>
    </div>
  );
};

export default SignUpForm;
