import React, { useState } from "react";
import SocialLogin from "./SocialLogin";
import UserNameIcon from "../icons/UserNameIcon";
import EmailIcon from "../icons/EmailIcon";
import PhoneNumberIcon from "../icons/PhoneNumberIcon";
import PasswordIcon from "../icons/PasswordIcon";
import ShowPasswordIcon from "../icons/ShowPasswordIcon";
import HidePasswordIcon from "../icons/HidePasswordIcon";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(true);
  const [userName, setUserName] = useState("");
  const [focusOnUserName, setFocusOnUserName] = useState(-1);
  const [email, setEmail] = useState("");
  const [focusOnEmail, setFocusOnEmail] = useState(-1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusOnPhoneNumber, setFocusOnPhoneNumber] = useState(-1);
  const [password, setPassword] = useState("");
  const [focusOnPassword, setFocusOnPassword] = useState(-1);

  const togglePasswordVisibility = () => {
    setShowPassword((showPassword) => !showPassword);
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
              Math.abs(focusOnUserName) === 1
                ? "border-blue-300"
                : userName === ""
                ? "border-red-500"
                : "border-green-400"
            } border-blue-300 rounded-md mt-2`}
          >
            <UserNameIcon />
            <input
              type="text"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => setFocusOnUserName(0)}
              onFocus={() => setFocusOnUserName(1)}
            />
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Email</label> */}
          <div
            className={`flex items-center border  ${
              Math.abs(focusOnEmail) === 1
                ? "border-blue-300"
                : email === ""
                ? "border-red-500"
                : "border-green-400"
            }  rounded-md mt-2`}
          >
            <EmailIcon />
            <input
              type="email"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onFocus={() => setFocusOnEmail(1)}
              onBlur={() => setFocusOnEmail(0)}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Phone Number</label> */}
          <div
            className={`flex items-center border ${
              Math.abs(focusOnPhoneNumber) === 1
                ? "border-blue-300"
                : phoneNumber === ""
                ? "border-red-500"
                : "border-green-400"
            } rounded-md mt-2`}
          >
            <PhoneNumberIcon />
            <input
              type="tel"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              onFocus={() => setFocusOnPhoneNumber(1)}
              onBlur={() => setFocusOnPhoneNumber(0)}
            />
          </div>
        </div>
        {/* Password */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Password</label> */}
          <div
            className={`flex items-center border ${
              Math.abs(focusOnPassword) === 1
                ? "border-blue-300"
                : password === ""
                ? "border-red-500"
                : "border-green-400"
            } rounded-md mt-2 relative`}
          >
            <PasswordIcon />
            <input
              type={showPassword ? "text" : "password"}
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Add padding-right for the icon
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusOnPassword(1)}
              onBlur={() => setFocusOnPassword(0)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              {showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          </div>
        </div>
        {/* Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-500 border-blue-300 rounded"
          />
          <label className="ml-2 text-gray-600">I am not a robot</label>
        </div>
        {/* Sign Up Button */}
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out">
          Sign Up
        </button>
      </form>
      <SocialLogin />
    </div>
  );
};

export default SignUpForm;
