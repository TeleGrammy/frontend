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
