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
          <div className="flex items-center border border-blue-300 rounded-md mt-2">
            <UserNameIcon />
            <input
              type="text"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="Username"
            />
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Email</label> */}
          <div className="flex items-center border border-blue-300 rounded-md mt-2">
            <EmailIcon />
            <input
              type="email"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Phone Number</label> */}
          <div className="flex items-center border border-blue-300 rounded-md mt-2">
            <PhoneNumberIcon />
            <input
              type="tel"
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
            />
          </div>
        </div>
        {/* Password */}
        <div className="mb-4">
          {/* <label className="block text-gray-600">Password</label> */}
          <div className="flex items-center border border-blue-300 rounded-md mt-2 relative">
            <PasswordIcon />
            <input
              type={showPassword ? "text" : "password"}
              className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Add padding-right for the icon
              placeholder="Password"
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
