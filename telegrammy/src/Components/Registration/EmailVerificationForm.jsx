import React, { useState, useEffect } from 'react';

const EmailVerificationForm = () => {
  const [code, setCode] = useState(new Array(6).fill(''));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // Function to handle changes in each code input field
  const handleCodeChange = (element, index) => {
    if (isNaN(element.value)) return;

    setCode(code.map((d, idx) => (idx === index ? element.value : d)));

    // Automatically focus on the next input box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log('Verification Code:', verificationCode);
    // To Do: handle sending the verification code
  };

  const handleResendCode = () => {
    setIsResendDisabled(true);
    setTimer(30);
    console.log('Code Resent'); // To Do: Handle code resending logic here
  };

  // Timer effect for countdown and enabling resend button
  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(countdown);
        setIsResendDisabled(false);
      }

      
      return () => clearInterval(countdown);
    }
    return undefined; 
  }, [isResendDisabled, timer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-0">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-md w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-700">Verify Your Email</h2>

        <form onSubmit={handleVerify}>
          <div className="flex justify-center mb-6 space-x-2 sm:space-x-3">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(e.target, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 m-1 text-center text-lg border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200"
          >
            Verify
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Didn&apos;t receive a code?{' '}
          <button
            className={`text-blue-500 ${isResendDisabled ? 'cursor-not-allowed opacity-50' : 'hover:underline'}`}
            onClick={handleResendCode}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Resend Code (${timer}s)` : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
