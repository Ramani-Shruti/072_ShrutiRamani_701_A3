import { useEffect, useState } from "react";
import api from "../api";
import Nav from "./Nav";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [grant, setGrant] = useState("No");
  const [msg, setMsg] = useState("");

  function loadLeaves() {
    api.get("/leaves").then((res) => setLeaves(res.data));
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/leaves", { date, reason, grant });
      setMsg("Leave added");
      setDate("");
      setReason("");
      setGrant("No");
      loadLeaves();
    } catch (err) {
      setMsg(err.response ? err.response.data.message : "Server error");
    }
  }

  return (
    <div>
      <Nav />
      <h2>Leave Application</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <p>Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></p>
        <p>Reason: <input value={reason} onChange={(e) => setReason(e.target.value)} /></p>
        <p>
          Grant:
          <input type="radio" name="grant" value="Yes" checked={grant === "Yes"} onChange={(e) => setGrant(e.target.value)} /> Yes
          <input type="radio" name="grant" value="No" checked={grant === "No"} onChange={(e) => setGrant(e.target.value)} /> No
        </p>
        <button type="submit">Add Leave</button>
      </form>

      <h3>My Leaves</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>#</th><th>Date</th><th>Reason</th><th>Granted</th></tr>
        </thead>
        <tbody>
          {leaves.map((l, i) => (
            <tr key={l._id}>
              <td>{i + 1}</td>
              <td>{new Date(l.date).toLocaleDateString()}</td>
              <td>{l.reason}</td>
              <td>{l.grant}</td>
            </tr>
          ))}
          {leaves.length === 0 && <tr><td colSpan="4">No leaves yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
