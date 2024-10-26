import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <h1 className="text-3xl font-bold underline">Hello TeleGrammy!</h1>
          }
        />

        <Route path="/signup/*" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
