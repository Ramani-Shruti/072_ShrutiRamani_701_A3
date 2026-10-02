import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";

// only allow if token is present
function Protected({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/leave" element={<Protected><Leave /></Protected>} />
    </Routes>
  );
}
