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
        <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
