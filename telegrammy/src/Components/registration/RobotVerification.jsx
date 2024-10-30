import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaForm = ({ dispatch }) => {
  const handleCaptchaChange = (captchaToken) => {
    if (captchaToken !== null) {
      dispatch({ type: 'captchaVerified', payload: true });
      dispatch({ type: 'captchaToken', payload: captchaToken });
    }
  };

  const handleCaptchaExpired = () => {
    dispatch({ type: 'captchaVerified', payload: false });
    dispatch({ type: 'captchaToken', payload: null });
  };

  return (
    <ReCAPTCHA
      sitekey="6LcAaGUqAAAAAPAgFpz5Ua_jnzb3rEuC2qZJBsJv"
      onChange={handleCaptchaChange}
      onExpired={handleCaptchaExpired}
    />
  );
};

export default ReCaptchaForm;
