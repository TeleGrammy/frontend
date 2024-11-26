import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import AuthCallback from './Components/registration/AuthCallback';

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
      </Routes>
    </BrowserRouter>
  );
}
