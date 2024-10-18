import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaForm = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  return (
    <ReCAPTCHA
      sitekey="6LcAaGUqAAAAAPAgFpz5Ua_jnzb3rEuC2qZJBsJv"
      onChange={handleCaptchaChange}
    />
  );
};

export default ReCaptchaForm;
