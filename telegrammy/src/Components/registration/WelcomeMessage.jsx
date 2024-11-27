import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeMessage = ({ signIn = true }) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-none bg-sky-950 p-6 text-white md:w-1/2 md:rounded-lg md:p-8">
      <img src="/logo.png" alt="Telegram" className="mb-4 w-32 md:w-36" />
      <h2 className="mb-2 text-2xl font-semibold md:mb-4 md:text-3xl">
        Welcome to
      </h2>
      <h1 className="text-3xl font-bold md:text-4xl">TELEGRAMMY</h1>
      <p className="mt-4">
        {signIn ? 'Already have an account?' : "You don't have an account!"}
      </p>
      <button
        className="mt-4 rounded-md border border-white px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-white hover:text-sky-950"
        onClick={() => navigate(signIn ? '/login' : '/signup')}
      >
        {signIn ? 'Sign In' : 'Sign Up'}
      </button>
    </div>
  );
};

export default WelcomeMessage;
