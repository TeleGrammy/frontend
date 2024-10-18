import React, { act, useReducer, useState } from "react";
import SocialLogin from "./SocialLogin";
import UserNameIcon from "../icons/UserNameIcon";
import EmailIcon from "../icons/EmailIcon";
import PhoneNumberIcon from "../icons/PhoneNumberIcon";
import PasswordIcon from "../icons/PasswordIcon";
import ShowPasswordIcon from "../icons/ShowPasswordIcon";
import HidePasswordIcon from "../icons/HidePasswordIcon";

const initialState = {
  showPassword: false,
  userName: "",
  focusOnUserName: -1,
  email: "",
  focusOnEmail: -1,
  phoneNumber: "",
  focusOnPhoneNumber: -1,
  password: "",
  focusOnPassword: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case "togglePass":
      return { ...state, showPassword: !state.showPassword };
    case "userName":
      return { ...state, userName: action.payload };
    case "focusUserName":
      return { ...state, focusOnUserName: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "focusEmail":
      return { ...state, focusOnEmail: action.payload };
    case "phoneNumber":
      return { ...state, phoneNumber: action.payload };
    case "focusPhone":
      return { ...state, focusOnPhoneNumber: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "focusPass":
      return { ...state, focusOnPassword: action.payload };
    default:
      throw new Error("Unknown");
  }
}

const SignUpForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const togglePasswordVisibility = () => {
    dispatch({ type: "togglePass" });
  };
  return (
    <div className="w-full md:w-1/2 p-6 md:p-7">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 md:mb-8">
        Sign Up
      </h2>
      <form>
        {/* Username */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Username</label> */}
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnUserName) === 1
                ? "border-sky-500"
                : state.userName === ""
                  ? "border-red-500"
                  : "border-green-400"
            } border-blue-300 rounded-md mt-2`}
          >
            <UserNameIcon />
            <input
              id="username"
              type="text"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="username"
              onChange={(e) =>
                dispatch({ type: "userName", payload: e.target.value })
              }
              onBlur={() => dispatch({ type: "focusUserName", payload: 0 })}
              onFocus={() => dispatch({ type: "focusUserName", payload: 1 })}
            />
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Email</label> */}
          <div
            className={`flex items-center border  ${
              Math.abs(state.focusOnEmail) === 1
                ? "border-sky-500"
                : state.email === ""
                  ? "border-red-500"
                  : "border-green-400"
            }  rounded-md mt-2`}
          >
            <EmailIcon />
            <input
              id="email"
              type="email"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onFocus={() => dispatch({ type: "focusEmail", payload: 1 })}
              onBlur={() => dispatch({ type: "focusEmail", payload: 0 })}
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
            />
          </div>
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Phone Number</label> */}
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnPhoneNumber) === 1
                ? "border-sky-500"
                : state.phoneNumber === ""
                  ? "border-red-500"
                  : "border-green-400"
            } rounded-md mt-2`}
          >
            <PhoneNumberIcon />
            <input
              id="phone"
              type="tel"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
              onChange={(e) =>
                dispatch({ type: "phoneNumber", payload: e.target.value })
              }
              onFocus={() => dispatch({ type: "focusPhone", payload: 1 })}
              onBlur={() => dispatch({ type: "focusPhone", payload: 0 })}
            />
          </div>
        </div>
        {/* Password */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Password</label> */}
          <div
            className={`flex items-center border ${
              Math.abs(state.focusOnPassword) === 1
                ? "border-sky-500"
                : state.password === ""
                  ? "border-red-500"
                  : "border-green-400"
            } rounded-md mt-2 relative`}
          >
            <PasswordIcon />
            <input
              id="password"
              type={state.showPassword ? "text" : "password"}
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Add padding-right for the icon
              placeholder="Password"
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
              onFocus={() => dispatch({ type: "focusPass", payload: 1 })}
              onBlur={() => dispatch({ type: "focusPass", payload: 0 })}
            />
            <button
              id="show-hide-password"
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              {state.showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          </div>
        </div>
        {/* Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            id="not-a-robot"
            type="checkbox"
            className="h-4 w-4 text-blue-500 border-blue-300 rounded"
          />
          <label className="ml-2 text-gray-600">I am not a robot</label>
        </div>
        {/* Sign Up Button */}
        <button
          id="sign-up"
          className="w-full bg-sky-950 text-white py-2 px-4 rounded-md hover:bg-sky-800 transition-colors duration-300 ease-in-out"
        >
          Sign Up
        </button>
      </form>
      <SocialLogin />
    </div>
  );
};

export default SignUpForm;
