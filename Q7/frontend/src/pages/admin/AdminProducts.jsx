import { useEffect, useState } from "react";
import api from "../../api";

const empty = { name: "", description: "", price: "", category: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  function load() {
    api.get("/products").then((res) => setProducts(res.data));
  }

  useEffect(() => {
    load();
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    // FormData because of image upload
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    if (image) data.append("image", image);

    if (editId) await api.put("/products/" + editId, data);
    else await api.post("/products", data);

    setForm(empty);
    setImage(null);
    setEditId(null);
    e.target.reset();
    load();
  }

  function edit(p) {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description || "", price: p.price, category: p.category ? p.category._id : "" });
  }

  async function remove(id) {
    if (!window.confirm("Delete product?")) return;
    await api.delete("/products/" + id);
    load();
  }

  return (
    <div>
      <h2>{editId ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={save}>
        <p>Name: <input name="name" value={form.name} onChange={change} required /></p>
        <p>Description: <input name="description" value={form.description} onChange={change} /></p>
        <p>Price: <input type="number" name="price" value={form.price} onChange={change} required /></p>
        <p>
          Sub Category:{" "}
          <select name="category" value={form.category} onChange={change} required>
            <option value="">-- select --</option>
            {categories.map((main) => (
              <optgroup key={main._id} label={main.name}>
                {main.subs.map((sub) => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </p>
        <p>Image: <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></p>
        <button type="submit">{editId ? "Update" : "Add"}</button>{" "}
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>

      <h2>Products</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.image && <img src={"/uploads/" + p.image} width="60" alt="" />}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category ? p.category.name : "-"}</td>
              <td>
                <button onClick={() => edit(p)}>Edit</button>{" "}
                <button onClick={() => remove(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
