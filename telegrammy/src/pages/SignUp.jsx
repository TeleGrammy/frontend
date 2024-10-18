import React from "react";
import SignUpForm from "../Components/registration/SignUpForm";
import WelcomeMessage from "../Components/registration/WelcomeMessage";

const SignUp = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left section: Form */}
        <SignUpForm />

        {/* Right section: Welcome Message */}
        <WelcomeMessage />
      </div>
    </div>
  );
};

export default SignUp;
