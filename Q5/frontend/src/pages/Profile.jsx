import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Nav from "./Nav";

export default function Profile() {
  const [emp, setEmp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/profile")
      .then((res) => setEmp(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  if (!emp) return <p>Loading...</p>;

  return (
    <div>
      <Nav />
      <h2>My Profile</h2>
      <table border="1" cellPadding="6">
        <tbody>
          <tr><th>Emp ID</th><td>{emp.empId}</td></tr>
          <tr><th>Name</th><td>{emp.name}</td></tr>
          <tr><th>Email</th><td>{emp.email}</td></tr>
          <tr><th>Department</th><td>{emp.department}</td></tr>
          <tr><th>Designation</th><td>{emp.designation}</td></tr>
          <tr><th>Basic Salary</th><td>{emp.basicSalary}</td></tr>
          <tr><th>Gross Salary</th><td>{emp.grossSalary}</td></tr>
          <tr><th>Net Salary</th><td>{emp.netSalary}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
