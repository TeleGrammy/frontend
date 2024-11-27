import React, { useState } from 'react';
import SignUpForm from '../components/registration/SignUpForm';
import WelcomeMessage from '../components/registration/WelcomeMessage';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import EmailVerification from '../components/registration/EmailVerification';

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
            element={<EmailVerification email={verificationEmail} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default SignUp;
