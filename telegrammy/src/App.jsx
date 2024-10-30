import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
