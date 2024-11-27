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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginWithCallback } from '../../slices/authSlice';

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      dispatch(
        loginWithCallback({ user: { email: 's7tot@gmail.com' }, token }),
      ); // need to change to the user object from the response
    }

    navigate('/home'); // Redirect to a secure page
  }, [navigate]);

  return null;
};

export default AuthCallback;
