import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function UserOnly({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

function AdminOnly({ children }) {
  return localStorage.getItem("role") === "admin" ? children : <Navigate to="/login" />;
}

export default function App() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div>
      <p>
        {role === "admin" ? (
          <>
            <b>Admin:</b> <Link to="/admin/categories">Categories</Link> |{" "}
            <Link to="/admin/products">Products</Link> | <Link to="/admin/orders">Orders</Link> |{" "}
            <Link to="/">View Shop</Link>
          </>
        ) : (
          <>
            <Link to="/">Shop</Link> | <Link to="/cart">Cart</Link> | <Link to="/orders">My Orders</Link>
          </>
        )}
        {" | "}
        {name ? (
          <>Hi {name} <button onClick={logout}>Logout</button></>
        ) : (
          <><Link to="/login">Login</Link> | <Link to="/register">Register</Link></>
        )}
      </p>
      <hr />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<UserOnly><Cart /></UserOnly>} />
        <Route path="/orders" element={<UserOnly><MyOrders /></UserOnly>} />
        <Route path="/admin/categories" element={<AdminOnly><AdminCategories /></AdminOnly>} />
        <Route path="/admin/products" element={<AdminOnly><AdminProducts /></AdminOnly>} />
        <Route path="/admin/orders" element={<AdminOnly><AdminOrders /></AdminOnly>} />
      </Routes>
    </div>
  );
}
