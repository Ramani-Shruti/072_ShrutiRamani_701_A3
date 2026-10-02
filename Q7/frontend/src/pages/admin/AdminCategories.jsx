import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  function load() {
    api.get("/categories").then((res) => setCategories(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    await api.post("/categories", { name, parent: parent || null });
    setName("");
    load();
  }

  async function rename(cat) {
    const newName = prompt("New name", cat.name);
    if (!newName) return;
    await api.put("/categories/" + cat._id, { name: newName });
    load();
  }

  async function remove(id) {
    try {
      await api.delete("/categories/" + id);
      load();
    } catch (err) {
      alert(err.response.data.message);
    }
  }

  return (
    <div>
      <h2>Manage Categories</h2>
      <form onSubmit={add}>
        Name: <input value={name} onChange={(e) => setName(e.target.value)} required />{" "}
        Parent:{" "}
        <select value={parent} onChange={(e) => setParent(e.target.value)}>
          <option value="">-- None (main category) --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>{" "}
        <button type="submit">Add</button>
      </form>

      <ul>
        {categories.map((main) => (
          <li key={main._id}>
            <b>{main.name}</b> <button onClick={() => rename(main)}>Edit</button>{" "}
            <button onClick={() => remove(main._id)}>Delete</button>
            <ul>
              {main.subs.map((sub) => (
                <li key={sub._id}>
                  {sub.name} <button onClick={() => rename(sub)}>Edit</button>{" "}
                  <button onClick={() => remove(sub._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
