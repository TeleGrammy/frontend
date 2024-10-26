import React, { useState } from 'react';
import SignUpForm from '../Components/registration/SignUpForm';
import WelcomeMessage from '../Components/registration/WelcomeMessage';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import EmailVerificationForm from '../components/registration/EmailVerificationForm';

const SignUp = () => {
  const [verificationEmail, setVerificationEmail] = useState('');
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg md:w-3/4 md:flex-row lg:w-2/3">
        {/* Left section: Form */}
        {/* <SignUpForm /> */}

        {/* Right section: Welcome Message */}
        {/* <WelcomeMessage /> */}
        <Routes>
          <Route index element={<Navigate to="register" />} />
          <Route
            path="register"
            element={
              <>
                <SignUpForm setVerificationEmail={setVerificationEmail} />
                <WelcomeMessage />
              </>
            }
          />
          <Route
            path="verify"
            element={<EmailVerificationForm email={verificationEmail} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default SignUp;
