import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("All Products");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    loadProducts("", "All Products");
  }, []);

  function loadProducts(query, heading) {
    api.get("/products" + query).then((res) => setProducts(res.data));
    setTitle(heading);
  }

  async function addToCart(id) {
    if (!localStorage.getItem("token")) return navigate("/login");
    await api.post("/cart/add", { productId: id });
    alert("Added to cart");
  }

  return (
    <table width="100%">
      <tbody>
        <tr>
          <td valign="top" width="200">
            <h3>Categories</h3>
            <p><a href="#" onClick={() => loadProducts("", "All Products")}>All</a></p>
            {categories.map((main) => (
              <div key={main._id}>
                <b><a href="#" onClick={() => loadProducts("?main=" + main._id, main.name)}>{main.name}</a></b>
                <ul>
                  {main.subs.map((sub) => (
                    <li key={sub._id}>
                      <a href="#" onClick={() => loadProducts("?sub=" + sub._id, main.name + " > " + sub.name)}>
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </td>
          <td valign="top">
            <h3>{title}</h3>
            {products.length === 0 && <p>No products</p>}
            {products.map((p) => (
              <div key={p._id} style={{ border: "1px solid gray", padding: 8, margin: 5, display: "inline-block", width: 180 }}>
                {p.image && <img src={"/uploads/" + p.image} width="150" height="120" alt={p.name} />}
                <p><b>{p.name}</b></p>
                <p>Rs. {p.price}</p>
                <p><small>{p.description}</small></p>
                <button onClick={() => addToCart(p._id)}>Add to Cart</button>
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
