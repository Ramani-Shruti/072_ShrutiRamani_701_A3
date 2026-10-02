// used by both user "My Orders" and admin "Orders"
export default function OrderTable({ orders, showUser }) {
  if (orders.length === 0) return <p>No orders yet</p>;
  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          <th>Date</th>
          {showUser && <th>Customer</th>}
          <th>Items</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o._id}>
            <td>{new Date(o.createdAt).toLocaleString()}</td>
            {showUser && <td>{o.user ? o.user.name + " (" + o.user.email + ")" : "-"}</td>}
            <td>
              {o.items.map((i, idx) => (
                <div key={idx}>{i.name} x {i.qty} = {i.price * i.qty}</div>
              ))}
            </td>
            <td>Rs. {o.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
