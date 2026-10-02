import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cart").then((res) => setCart(res.data));
  }, []);

  async function changeQty(productId, qty) {
    const res = await api.put("/cart/" + productId, { qty });
    setCart(res.data);
  }

  async function checkout() {
    await api.post("/cart/checkout");
    alert("Order placed!");
    navigate("/orders");
  }

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <div>
      <h2>My Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <table border="1" cellPadding="6">
            <thead>
              <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
              {cart.map((i) => (
                <tr key={i.product._id}>
                  <td>{i.product.name}</td>
                  <td>{i.product.price}</td>
                  <td>
                    <button onClick={() => changeQty(i.product._id, i.qty - 1)}>-</button> {i.qty}{" "}
                    <button onClick={() => changeQty(i.product._id, i.qty + 1)}>+</button>
                  </td>
                  <td>{i.product.price * i.qty}</td>
                  <td><button onClick={() => changeQty(i.product._id, 0)}>Remove</button></td>
                </tr>
              ))}
              <tr><th colSpan="3">Total</th><th colSpan="2">Rs. {total}</th></tr>
            </tbody>
          </table>
          <p><button onClick={checkout}>Checkout</button></p>
        </>
      )}
    </div>
  );
}
