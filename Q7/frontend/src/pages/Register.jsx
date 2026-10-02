import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server error");
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p>Name: <input name="name" value={form.name} onChange={change} /></p>
        <p>Email: <input name="email" value={form.email} onChange={change} /></p>
        <p>Password: <input type="password" name="password" value={form.password} onChange={change} /></p>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
