import React from "react";
import logo from "../../assets/logo.png";

const WelcomeMessage = () => {
  return (
    <div className="w-full md:w-1/2 bg-sky-950 p-6 md:p-8 text-white flex flex-col justify-center items-center rounded-none md:rounded-lg">
      <img src={logo} alt="Telegram" className="w-32 md:w-36 mb-4" />
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-4">
        Welcome to
      </h2>
      <h1 className="text-3xl md:text-4xl font-bold">TELEGRAMMY</h1>
      <p className="mt-4">Already have an account?</p>
      <button className="mt-4 border border-white py-2 px-4 rounded-md hover:bg-white hover:text-sky-950 transition-colors duration-300 ease-in-out">
        Sign In
      </button>
    </div>
  );
};

export default WelcomeMessage;
