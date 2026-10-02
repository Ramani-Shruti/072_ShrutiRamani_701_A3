import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/login", { empId, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      navigate("/");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server error");
    }
  }

  return (
    <div>
      <h2>Employee Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p>Emp ID: <input value={empId} onChange={(e) => setEmpId(e.target.value)} /></p>
        <p>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
