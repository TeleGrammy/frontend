import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home';
import AuthCallback from './components/registration/AuthCallback';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';

import { SocketProvider } from './contexts/SocketContext';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem('user')).isAdmin);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthCallback setIsAdmin={setIsAdmin} />} />
        <Route path="/auth/*" element={<Auth setIsAdmin={setIsAdmin} />} />
        <Route
          path="/home"
          element={
            isAdmin ? (
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            ) : (
              <ProtectedRoute>
                <SocketProvider>
                  <Home />
                </SocketProvider>
              </ProtectedRoute>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
