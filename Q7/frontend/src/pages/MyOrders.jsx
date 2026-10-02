import { useEffect, useState } from "react";
import api from "../api";
import OrderTable from "./OrderTable";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      <OrderTable orders={orders} />
    </div>
  );
}
