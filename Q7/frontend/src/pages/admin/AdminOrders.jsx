import { useEffect, useState } from "react";
import api from "../../api";
import OrderTable from "../OrderTable";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      <OrderTable orders={orders} showUser />
    </div>
  );
}
