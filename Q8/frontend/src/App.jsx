import { useEffect, useState } from "react";

const API = "/api/students";
const empty = { rollNo: "", name: "", email: "", course: "", marks: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch(API);
    setStudents(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    const res = await fetch(editId ? API + "/" + editId : API, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, marks: form.marks === "" ? null : form.marks }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg("Error: " + data.message);
      return;
    }
    setMsg(editId ? "Student updated" : "Student added");
    setForm(empty);
    setEditId(null);
    load();
  }

  function edit(s) {
    setEditId(s.id);
    setForm({ rollNo: s.rollNo, name: s.name, email: s.email, course: s.course || "", marks: s.marks ?? "" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this student?")) return;
    await fetch(API + "/" + id, { method: "DELETE" });
    setMsg("Student deleted");
    load();
  }

  return (
    <div>
      <h2>Student CRUD (Express + Sequelize + React)</h2>
      {msg && <p>{msg}</p>}

      <form onSubmit={save}>
        <p>Roll No: <input type="number" name="rollNo" value={form.rollNo} onChange={change} required /></p>
        <p>Name: <input name="name" value={form.name} onChange={change} required /></p>
        <p>Email: <input type="email" name="email" value={form.email} onChange={change} required /></p>
        <p>Course: <input name="course" value={form.course} onChange={change} /></p>
        <p>Marks: <input type="number" name="marks" value={form.marks} onChange={change} /></p>
        <button type="submit">{editId ? "Update" : "Add"}</button>{" "}
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>

      <h3>Students</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Roll No</th><th>Name</th><th>Email</th><th>Course</th><th>Marks</th><th>Action</th></tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.rollNo}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.marks}</td>
              <td>
                <button onClick={() => edit(s)}>Edit</button>{" "}
                <button onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && <tr><td colSpan="6">No students</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
