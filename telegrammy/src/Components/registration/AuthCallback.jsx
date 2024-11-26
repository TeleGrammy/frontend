// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('accessToken');

//     if (token) {
//       localStorage.setItem('token', token); // Store the token securely
//       console.log('Token:', token);
//       navigate('/home'); // Redirect to a secure page
//     } else {
//       console.error('No token found in the URL');
//     }
//   }, [navigate]);

//   return <div>Loading...</div>;
// };

// export default AuthCallback;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  const setTokenInCookie = (token) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    document.cookie = `accessToken=${token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      setTokenInCookie(token); // Store the token in a cookie
      console.log('Token stored in cookie:', token);
      navigate('/home'); // Redirect to a secure page
    } else {
      console.error('No token found in the URL');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
