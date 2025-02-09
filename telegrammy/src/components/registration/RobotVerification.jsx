import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaForm = ({ dispatch, captchaRef }) => {
  const handleCaptchaChange = (captchaToken) => {
    console.log(captchaToken);
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
      ref={captchaRef}
      sitekey="6LcQJGEqAAAAADBuvZhUXn5f8FqnU0Vsto5Um5NF"
      onChange={handleCaptchaChange}
      onExpired={handleCaptchaExpired}
    />
  );
};

export default ReCaptchaForm;
