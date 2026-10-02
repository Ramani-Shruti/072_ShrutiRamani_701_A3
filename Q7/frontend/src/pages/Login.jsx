import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "admin" ? "/admin/categories" : "/");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server error");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p>Email: <input value={email} onChange={(e) => setEmail(e.target.value)} /></p>
        <p>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></p>
        <button type="submit">Login</button>
      </form>
      <p><small>Admin: admin@shop.com / admin123</small></p>
    </div>
  );
}
