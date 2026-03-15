import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./admin.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const baseURL = "https://chocolicious-api.onrender.com";
  const [activeTab, setActiveTab] = useState("orders");
  const [newItem, setNewItem] = useState({ 
    item_name: "", 
    category: "Raw Material", 
    quantity: 0, 
    unit: "kg" 
  });
  const sortedOrders = [...orders].sort((a, b) => {
  const dateA = new Date(a.delivery_date || a.deliveryDate || 0);
  const dateB = new Date(b.delivery_date || b.deliveryDate || 0);
  return dateA - dateB; // earliest date first
});
  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  const token = localStorage.getItem("token"); 
  if (!token) return;
  
  try {
    // 1. Fetch Orders
    const orderRes = await fetch(`${baseURL}/api/admin/orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const orderData = await orderRes.json();
    
    // Simple assignment: if it's an array, use it. If not, look for .orders
    setOrders(Array.isArray(orderData) ? orderData : (orderData.orders || []));

    // 2. Fetch Inventory
    const invRes = await fetch(`${baseURL}/api/admin/inventory`, {
      headers: { "Authorization": `Bearer ${token}` } 
    });
    const invData = await invRes.json();
    
    // Simple assignment: This got your inventory working before!
    setInventory(Array.isArray(invData) ? invData : (invData.inventory || []));

    // 3. Fetch Custom Orders
const customRes = await fetch(`${baseURL}/api/admin/customizations`, {
  headers: { "Authorization": `Bearer ${token}` }
});

const customData = await customRes.json();

setCustomOrders(
  Array.isArray(customData)
    ? customData
    : (customData.customizations || [])
);

    console.log("Data Refreshed Successfully");

  } catch (err) {
    console.error("Fetch Error:", err);
    // We removed the setOrders([]) here so the screen doesn't wipe out on a glitch
  }
};

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res =await fetch(`${baseURL}/api/admin/orders/status`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: id, order_status: newStatus })
      });
      if (res.ok){
        fetchData();
      } else {
        console.error("Update failed with status:", res.status);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

 const markAsPaid = async (orderId, mode) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${baseURL}/api/admin/payments/confirm`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        order_id: orderId, 
        payment_mode: mode, 
        payment_status: "Completed" // This MUST match the string in your filter
      }),
    });

    if (res.ok) {
      alert(`Order #${orderId} marked as Paid via ${mode}! 🍫`);
      await fetchData(); // Refresh everything
    } else {
      const errorData = await res.json();
      console.error("Payment update failed:", errorData.message);
    }
  } catch (err) {
    console.error("Payment error:", err);
  }
};

  const handleAddInventory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseURL}/api/admin/inventory/add`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        alert("New ingredient added to the pantry!");
        setNewItem({ item_name: "", category: "Raw Material", quantity: 0, unit: "kg" });
        fetchData();
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDeleteInventory = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseURL}/api/admin/inventory/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
      alert("Item removed from pantry!");
      fetchData(); // Refresh the table
    } else {
      const data = await res.json();
      alert(`Delete failed: ${data.message || "Unauthorized"}`);
    }
  } catch (err) {
    console.error("Delete failed:", err);
    }
  };

  const updateCustomStatus = async (id, newStatus) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${baseURL}/api/admin/customizations/status`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        status: newStatus
      })
    });

    if (res.ok) {
      fetchData();
    }

  } catch (err) {
    console.error("Custom order update failed", err);
  }
};


console.log("Active count:", orders.filter(o => (o.payment_status || "").toLowerCase() !== "completed").length);
console.log("History count:", orders.filter(o => (o.payment_status || "").toLowerCase() === "completed").length);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Bakery Command Center</h1>
        <div className="diamond-divider-small">
          <span></span><span></span><span></span>
        </div>
      </header>

      <div className="admin-tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Active Orders</button>
        <button className={activeTab === "custom" ? "active" : ""} onClick={() => setActiveTab("custom")}>Custom Orders</button>
        <button className={activeTab === "inventory" ? "active" : ""} onClick={() => setActiveTab("inventory")}>Inventory</button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>Order History</button>

      </div>

      <main className="admin-glass-card">
        {activeTab === "orders" ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Set Status</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            {/* Replace your existing <tbody> content with this */}
<tbody>
  {sortedOrders.filter(o => {
    // Logic: If payment is NOT 'completed', it belongs in Active Orders.
    // This ensures even 'Delivered' orders stay here until they are PAID.
    const pStatus = (o.payment_status || "").toLowerCase();
    return pStatus !== "completed";
  }).length > 0 ? (
    sortedOrders
        .filter(o => (o.payment_status || "").toLowerCase() !== "completed")
        .map((order) => {
        const isDelivered = (order.order_status || "").toLowerCase() === "delivered";
        return (
          <tr key={order.order_id}>
            <td>
              <strong>ID: {order.customer_id}</strong><br/>
              <small><FaUser /> {order.fullName || order.name || "N/A"}</small><br/>
              <small>📅 Delivery: {
                order.delivery_date
                  ? new Date(order.delivery_date).toLocaleDateString()
                  : order.deliveryDate
                  ? new Date(order.deliveryDate).toLocaleDateString()
                  : "N/A"}
              </small><br/>
              <small>📞 {order.phone || "N/A"}</small><br/>
              <small>🏠 {order.address || "N/A"}</small>
            </td>
            <td className="product-cell">{order.product_name}</td>
            <td className="amount-cell">₹{order.price}</td>
            <td>
              <span className={`status-pill status-${(order.order_status || "pending").toLowerCase().replace(/\s+/g, '-')}`}>
                {order.order_status}
              </span>
            </td>
            <td>
              <select 
                className="admin-select"
                value={order.order_status} 
                onChange={(e) => updateStatus(order.order_id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Baking">Baking</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </td>
            <td>
              <div className="payment-actions">
                <button 
                  disabled={!isDelivered}
                  onClick={() => {
                    if(window.confirm(`Mark ₹${order.price} as paid via Cash?`)) 
                      markAsPaid(order.order_id, "Cash");
                  }} 
                  className={`pay-btn cash ${!isDelivered ? 'disabled-btn' : ''}`}
                >
                  Cash
                </button>
                <button 
                  disabled={!isDelivered}
                  onClick={() => {
                    const upiId = window.prompt(`Order Amount: ₹${order.price}\nEnter UPI ID:`, "customer@upi");
                    if(upiId) markAsPaid(order.order_id, `UPI (${upiId})`);
                  }} 
                  className={`pay-btn upi ${!isDelivered ? 'disabled-btn' : ''}`}
                >
                  UPI
                </button>
              </div>
            </td>
          </tr>
        );
      })
  ) : (
    <tr><td colSpan="6" className="empty-msg">No active orders! 🧁</td></tr>
  )}
</tbody>
          </table>
        ) : activeTab === "history" ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Order Items</th>
                <th>Amount Paid</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>

{/* NORMAL ORDERS HISTORY */}
{orders
  .filter(o => (o.payment_status || "").toLowerCase() === "completed")
  .map((order) => (
<tr key={`order-${order.order_id}`} className="history-row">
<td>
<strong>ID: {order.customer_id}</strong><br/>
<small><FaUser /> {order.fullName || order.name || "N/A"}</small><br/>
<small>📞 {order.phone || "N/A"}</small>
</td>

<td>{order.product_name}</td>
<td>₹{order.price}</td>
<td>{new Date(order.order_date).toLocaleDateString()}</td>
<td><span className="category-tag">{order.payment_mode}</span></td>
<td><span className="status-pill status-delivered">Delivered</span></td>
</tr>
))}

{/* CUSTOM ORDER HISTORY */}
{customOrders
  .filter(o => (o.status || "").toLowerCase() === "delivered")
  .map((order) => (
<tr key={`custom-${order.id}`} className="history-row">

<td>
<strong>Custom Order</strong><br/>
<small>📞 {order.phone}</small>
</td>

<td>{order.order_type}</td>
<td>₹{order.price}</td>
<td>{new Date(order.created_at).toLocaleDateString()}</td>
<td><span className="category-tag">Custom</span></td>
<td><span className="status-pill status-delivered">Delivered</span></td>

</tr>
))}

{orders.filter(o => (o.payment_status || "").toLowerCase() === "completed").length === 0 &&
customOrders.filter(o => (o.status || "").toLowerCase() === "delivered").length === 0 && (
<tr>
<td colSpan="6" className="empty-msg">
No history found yet 🍰
</td>
</tr>
)}

</tbody>

          </table>
        ) : activeTab === "custom" ? (
  <table className="custom-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Order Type</th>
        <th>Details</th>
        <th>Price</th>
        <th>Image</th>
        <th>Status</th>
        <th>Update</th>
      </tr>
    </thead>

    <tbody>
      {customOrders
        .filter(o => (o.status || "").toLowerCase() !== "delivered")
        .length > 0 ? (

        customOrders
          .filter(o => (o.status || "").toLowerCase() !== "delivered")
          .map((order) => (
            <tr key={order.id}>
              <td>{order.fullName || "N/A"}</td>

              <td>{order.phone}</td>

              <td>{order.order_type}</td>

              <td className="product-cell">
                {order.custom_info}
              </td>

              <td className="price-cell">
                ₹{order.price}
              </td>

              <td>
                {order.image_url ? (
                  <a href={order.image_url} target="_blank" rel="noreferrer">
                    View Image
                  </a>
                ) : (
                  "No Image"
                )}
              </td>

              <td>
                <span className={`status-pill status-${(order.status || "pending")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}>
                  {order.status}
                </span>
              </td>

              <td>
                <select
                  value={order.status}
                  className="admin-select"
                  onChange={(e) =>
                    updateCustomStatus(order.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Baking</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </td>
            </tr>
          ))

      ) : (
        <tr>
          <td colSpan="8" className="empty-msg">
            No active custom orders 🍫
          </td>
        </tr>
      )}
    </tbody>
  </table>
)
: (
          <div className="inventory-dashboard-layout">
            <div className="inventory-form-card">
              <h3>Add New Ingredient</h3>
              <form onSubmit={handleAddInventory}>
                <div className="admin-input-group">
                  <label>Item Name</label>
                  <input 
                    type="text" 
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
                    required 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Category</label>
                  <select 
                    value={newItem.category} 
                    onChange={(e) => setNewItem({...newItem, category: e.target.value, unit: e.target.value === "Packaging" ? "pcs" : "kg"})}
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Ready Product">Ready Product</option>
                  </select>
                </div>
                <div className="admin-flex-row">
                  <div className="admin-input-group">
                    <label>Quantity</label>
                    <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} />
                  </div>
                  <div className="admin-input-group">
                    <label>Unit</label>
                    <input type="text" value={newItem.unit} readOnly />
                  </div>
                </div>
                <button type="submit" className="admin-primary-btn">ADD TO PANTRY</button>
              </form>
            </div>
            <div className="inventory-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.item_id}>
                      <td>{item.item_name}</td>
                      <td><span className="category-tag">{item.category}</span></td>
                      <td>{item.quantity} {item.unit}</td>
                      <td><button onClick={() => handleDeleteInventory(item.item_id)} className="delete-stock-btn">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}