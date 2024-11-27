import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import SignUp from './SignUp';
import Login from './Login';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

function Auth() {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);

  const { isLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) {
      navigate('/home');
    } else {
      setShouldRender(true);
    }
  }, [isLogin, navigate]);

  if (!shouldRender) return null;

  return (
    <Routes>
      <Route path="signup/*" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default Auth;
