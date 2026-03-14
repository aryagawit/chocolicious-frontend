import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser,FaReceipt, FaEnvelope, FaVenusMars, FaBirthdayCake, FaGift, FaMapMarkerAlt , FaPhone} from "react-icons/fa";
import './profile.css';

export default function ProfileSetup() {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const navigate = useNavigate();
  const baseURL = "https://chocolicious-api.onrender.com";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.is_admin === 1 || user.is_admin === true;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone:"",
    gender: "",
    dob: "",
    anniversary: "",
    address: "" 
  });

  useEffect(() => {
  const token = localStorage.getItem("token");
  const baseURL = "https://chocolicious-api.onrender.com";
  if (!token) return;

  // 1. Define the Profile Fetch (Everyone needs this)
  const fetchSavedData = async () => {
    try {
      const res = await fetch(`${baseURL}/api/user/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setFormData({
          fullName: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          gender: data.user.gender || "",
          dob: data.user.dob ? data.user.dob.split('T')[0] : "",
          anniversary: data.user.anniversary ? data.user.anniversary.split('T')[0] : "",
          address: data.user.address || ""
        });
      }
    } catch (err) {
      console.log("Profile load failed.");
    }
  };

  // 2. Define the Orders Fetch (Only for customers)
  const fetchOrders = async () => {
    // 🔥 MOVE THE CHECK HERE
    if (isAdmin) return; 
    const baseURL = "https://chocolicious-api.onrender.com";
    try {
      const res = await fetch(`${baseURL}/api/orders/my-orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  // 3. Trigger both
  fetchSavedData();
  fetchOrders();
}, [isAdmin]); // Dependencies ensure it runs when login state changes

  const isFormValid = formData.fullName.trim() !== "" && formData.gender !== "" && formData.phone.trim() !== "";

  // 2. Handle Saving/Updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const storedPhone = localStorage.getItem("userPhone");
    const baseURL = "https://chocolicious-api.onrender.com";
    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone:formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      anniversary: formData.anniversary,
      address: formData.address
    };

    try {
      const res = await fetch(`${baseURL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Profile saved successfully!");
        // We don't reload! This keeps the "Amazon" feel of a smooth update.
        navigate("/"); 
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      alert("Connection error. Is the backend running?");
    }
  };

// Add this function inside your component
const navigateToReceipt = (order) => {
  // Ensure we have a valid ID for the URL
  const newId = order.id; 
  
  if (!newId) {
    console.error("System Error: Order ID not found. Please refresh the page.");
    return;
  }

  const itemsArray = order.product_name && order.product_name.includes('+')
    ? order.product_name.split('+').map(item => item.trim()) 
    : [order.product_name || "Chocolate Order"];

  navigate(`/receipt/${newId}`, {
    state: {
      orderId: newId, 
      product_name: order.product_name, 
      amount: order.total_amount, 
      order_date: order.order_date,
      itemsList: itemsArray,
      address: order.address || "Address provided at checkout",
      success: true 
    }
  });
};
  
 return (
  <div className="setup-container">
    {/* 3. Use conditional class to center the card if no sidebar */}
      <div className={isAdmin ? "dashboard-center-only" : "dashboard-grid"}>
      
      {/* LEFT COLUMN: Profile Form */}
      <div className="setup-glass-card">
        <div className="setup-branding">
          <h1 className="brand-font">Chocolicious</h1>
          <p className="tagline">The Art of Fine Chocolate</p>
        </div>

        <div className="setup-header">
          <h2>Welcome to the Family</h2>
          <p>Help us personalize your chocolate experience!</p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label><FaUser style={{ color: "var(--gold)" }} /> Full Name <span>*</span></label>
            <div className={`input-wrapper ${formData.fullName === "" ? "warning" : "success"}`}>
              <input 
                type="text" 
                placeholder="Ex: Arya Gawit" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              {formData.fullName === "" && <span className="error-dot">!</span>}
            </div>
          </div>

          <div className="input-group">
            <label><FaPhone style={{ color: "#2e333b" }} /> Phone Number <span>*</span></label>
            <div className="input-wrapper">
              <input
                type="tel"
                placeholder="Ex: 9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, "")
                  })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label><FaEnvelope style={{ color: "#8fbaff" }} /> Email Address (Optional)</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="gender-selection">
            <label><FaVenusMars style={{ color: "#ff9fb3" }} /> Gender <span>*</span></label>
            <div className="gender-pills">
              <label className={`pill ${formData.gender === 'Male' ? 'active' : ''}`}>
                <input 
                  type="radio" name="gender" value="Male" 
                  checked={formData.gender === 'Male'} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                />
                Male
              </label>
              <label className={`pill ${formData.gender === 'Female' ? 'active' : ''}`}>
                <input 
                  type="radio" name="gender" value="Female" 
                  checked={formData.gender === 'Female'} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                />
                Female
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label><FaBirthdayCake style={{ color: "#ffb347" }} /> Birthday</label>
              <input 
                type="date" className="date-input" 
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label><FaGift style={{ color: "#9b6d20" }} /> Anniversary</label>
              <input 
                type="date" className="date-input" 
                value={formData.anniversary}
                onChange={(e) => setFormData({...formData, anniversary: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group">
            <label><FaMapMarkerAlt style={{ color: "#ff6b6b" }} /> Delivery Address</label>
            <div className="input-wrapper">
              <textarea 
                rows="2"
                placeholder="Your full address..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`final-submit-btn ${isFormValid ? "unlocked" : "locked"}`}
            disabled={!isFormValid}
          >
            {formData.fullName ? "UPDATE PROFILE" : "CREATE MY PROFILE"}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: Order History Sidebar */}
      {!isAdmin && (
      <aside className="orders-sidebar">
  <div className="sidebar-header">
    <h3 className="sidebar-title">
      <FaReceipt style={{ color: "var(--gold-deep)" }} /> Order History
    </h3>
    <p className="sidebar-subtitle">Your recent sweet treats</p>
  </div>
  
  <div className="orders-mini-list">
    {orders.length > 0 ? (
      orders.map((order) => (
  // Use order.id OR order.order_id to ensure the key exists
  <div key={order.id || order.order_id} className="mini-order-item" onClick={() => navigateToReceipt(order)}>
    <div className="order-info-top">
      <span className="order-id">#CHOC-{String(order.id || order.order_id || 0).padStart(4, '0')}</span>
      {/* Use || fallback to prevent crashes */}
      <span className="order-amount">₹{order.total_amount  || "0"}</span>
    </div>
    <div className="order-info-bottom">
      <span>
        {order.order_date ? new Date(order.order_date).toLocaleDateString('en-IN') : "Pending"}
      </span>
      <span className="view-link">Details →</span>
    </div>
  </div>
))
    ) : (
      <div className="empty-orders">
        <p>No orders placed yet!</p>
        <button onClick={() => navigate('/products')} className="shop-now-btn">Shop Now</button>
      </div>
    )}
  </div>
</aside>
      )}
    </div>
  </div>
);
}