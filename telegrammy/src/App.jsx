import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import AuthCallback from './components/registration/AuthCallback';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Auth from './pages/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthCallback />} />
        <Route path="/signup/*" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        =========
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        >>>>>>>>> Temporary merge branch 2
      </Routes>
    </BrowserRouter>
  );
}
