
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route index element={<Navigate to="chatlist" />} />
          <Route path="chatlist" element={<h1>chatlist</h1>} />
          <Route path="setting" element={<h1>setting</h1>} />
        </Route>
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

