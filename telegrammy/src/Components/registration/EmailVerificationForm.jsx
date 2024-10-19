import React, { useState, useEffect } from 'react';

const EmailVerificationForm = ({ email}) => {
  const [code, setCode] = useState(new Array(6).fill(''));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Function to handle changes in each code input field
  const handleCodeChange = (element, index) => {
    if (isNaN(element.value) || element.value.length > 1) return; 

    setCode((prevCode) =>
      prevCode.map((digit, idx) => (idx === index ? element.value : digit))
    );

    // Automatically focus on the next input box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
    
  };

  // Check if all code inputs are filled
  const isCodeComplete = () => code.every((digit) => digit !== '');

  // responses errors handlers
  const handleVerifyError = (response) => {
    switch (response.status) {
      case 400:
        setError('Invalid verification code.');
        break;
      case 404:
        setError('User not found.');
        break;
      case 409:
        setError('Conflict with existing user data.');
        break;
      case 500:
        setError('Internal server error.');
        break;
      default:
        setError('Something went wrong. Please try again.');
    }
  };

  const handleResendError = (response) => {
    switch (response.status) {
      case 400:
        setResendMessage('Missing required fields.');
        break;
      case 404:
        setResendMessage('User not found or already verified.');
        break;
      case 500:
        setResendMessage('Internal server error.');
        break;
      default:
        setResendMessage('Something went wrong. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (!verificationCode) {
      setError('Verification code is required.');
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setError('');
        console.log('Verification successful:', data);
      } else {
        handleVerifyError(response);
        setSuccess(false);
      }
    } catch (error) {
      setError('An error occurred while verifying the code.');
      console.error('Error:', error);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setResendMessage('Email is required to resend verification code.');
      return;
    }

    setIsResendDisabled(true);
    setTimer(30);

    try {
      const response = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendMessage('Verification code resent successfully.');
      } else {
        handleResendError(response);
      }
    } catch (error) {
      setResendMessage('An error occurred while resending the code.');
      console.error('Error:', error);
    }

    setTimer(30);
  };

  // Timer effect for countdown and enabling resend button
  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 1) {
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

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">Verification successful!</p>}
        {resendMessage && <p className="text-blue-500 text-center mb-4">{resendMessage}</p>}

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
            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-200 ${isCodeComplete() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`} // Change background color based on button state
            disabled={!isCodeComplete()} // Disable button if code is not complete
          >
            Submit
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
