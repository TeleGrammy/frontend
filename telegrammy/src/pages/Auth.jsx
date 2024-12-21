import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import SignUp from './SignUp';
import Login from './Login';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

const Auth = ({ setIsAdmin }) => {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.isAdmin !== undefined) {
        setIsAdmin(user.isAdmin); // Safely call setIsAdmin
      }
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } else {
      setShouldRender(true);
      setLoading(false);
    }
  }, [isLogin, navigate, setIsAdmin]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!shouldRender) return null;

  return (
    <Routes>
      <Route path="signup/*" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default Auth;