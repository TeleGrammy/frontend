import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);

  const { isLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLogin) {
      navigate('/auth/login');
    } else {
      setShouldRender(true);
    }
  }, [navigate, isLogin, shouldRender]);

  if (!shouldRender) return null;

  return <>{children}</>;
}

export default ProtectedRoute;
