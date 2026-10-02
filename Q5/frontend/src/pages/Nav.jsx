import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  }

  return (
    <p>
      <Link to="/">Home</Link> | <Link to="/profile">My Profile</Link> |{" "}
      <Link to="/leave">Leave Application</Link> | <button onClick={logout}>Logout</button>
    </p>
  );
}
