import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaTruck, FaMapPin, FaReceipt, FaArrowLeft, FaPhone } from 'react-icons/fa';
import { CartContext } from "../context/CartContext"; 
import "./checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  // 1. Correctly using useContext for CartContext
  const { clearCart } = useContext(CartContext);
  const baseURL = "https://chocolicious-api.onrender.com";
  // --- ALL STATE DEFINITIONS MUST BE INSIDE THE FUNCTION ---
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    address: "",
    phone: "",
    fullName: "",
    deliveryDate: "",
    timeSlot: "Evening (6 PM - 9 PM)",
    paymentMode: "Pay on Delivery (Cash/UPI)"
  });
  const [orderDetails, setOrderDetails] = useState({
    total: 0,
    name: "",
    id: ""
  });

  // 2. Logic for form validation
  const isFormValid =
    (orderData.address || "").trim() !== "" &&
    (orderData.phone || "").trim() !== "" &&
    orderData.deliveryDate !== "" && orderData.fullName !== "";

  // 3. Load order summary from LocalStorage
  useEffect(() => {
    setOrderDetails({
      total: localStorage.getItem("orderTotal") || 0,
      name: localStorage.getItem("orderName") || "Chocolate Hamper",
      id: localStorage.getItem("tempOrderId") || "PENDING"
    });
    const savedTotal = localStorage.getItem("orderTotal");
    if (savedTotal) {
      setTotal(savedTotal);
    }
  }, []);

  // 4. Load saved profile address
  useEffect(() => {
    const fetchSavedAddress = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${baseURL}/api/user/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
       if (res.ok && data.user) {
          setOrderData(prev => ({
            ...prev,
            address: data.user.address || "",
            phone: data.user.phone || "",
            fullName: data.user.name || ""
          }));
      }
      } catch (err) {
        console.error("Failed to fetch address", err);
      }
    };
    fetchSavedAddress();
  }, []);

  // 5. Handle Order Placement
  const handlePlaceOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const payload = {
      orderName: localStorage.getItem("orderName"),
      amount: localStorage.getItem("orderTotal"),
      fullName: orderData.fullName,
      phone: orderData.phone,
      address: orderData.address,
      deliveryDate: orderData.deliveryDate,
      timeSlot: orderData.timeSlot
    };

    try {
      const res = await fetch(`${baseURL}/api/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.success) {
        // Clear the cart in state and DB
        if (clearCart) await clearCart();
        
        // Clean storage and navigate
        localStorage.removeItem("orderTotal");
        localStorage.removeItem("orderName");
        const newId = data.orderId || data.id || localStorage.getItem("tempOrderId");
        navigate(`/receipt/${newId}`, { state: { order: data } });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 6. Location Tracker
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setOrderData(prev => ({ 
            ...prev, 
            address: data.display_name || `Lat: ${latitude}, Lon: ${longitude}` 
          }));
        } catch (err) {
          setOrderData(prev => ({ ...prev, address: `Lat: ${latitude}, Lon: ${longitude}` }));
        }
      });
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        <h3><FaTruck /> Delivery Details</h3>
        <div className="name-section">
          <label><FaPhone />Name</label>
          <input
            type="text"
            value={orderData.fullName}
            onChange={(e) =>
              setOrderData({ ...orderData, fullName: e.target.value })
            }
            placeholder="Enter your name"
          />
        </div>
        <div className="phone-section">
          <label><FaPhone />Phone Number</label>
          <input
            type="tel"
            value={orderData.phone}
            onChange={(e) =>
              setOrderData({ ...orderData, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </div>
        <div className="address-section">
          <label>Delivery Address</label>
          <textarea 
            value={orderData.address}
            onChange={(e) => setOrderData({...orderData, address: e.target.value})}
            placeholder="Where should we send your chocolates?"
          />
          <button type="button" className="location-btn" onClick={handleGetCurrentLocation}>
            <FaMapPin /> Use Current Location
          </button>
        </div>

        <div className="timing-section">
          <label><FaCalendarCheck /> Select Delivery Date</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setOrderData({...orderData, deliveryDate: e.target.value})}
          />
        </div>

        <aside className="order-summary-box-checkout">
          <div className="summary-header">
            <h3><FaReceipt /> Order Summary</h3>
            <span className="order-id-badge">ID: {orderDetails.id}</span>
          </div>
          <div className="summary-item-name">
            <strong>Items:</strong> {orderDetails.name}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <span className="free-text">FREE</span> 
          </div>
          <div className="summary-divider"></div>
          <div className="summary-line total-highlight">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </aside>

        <div className="payment-section">
          <h4>Payment Method</h4>
          <p className="cod-badge">Cash on Delivery / UPI on Delivery</p>
          <span>No prepayment required! pay once you receive your sweets.</span>
        </div>

        <button 
          className={`confirm-order-btn ${isFormValid && !loading ? "unlocked" : "locked"}`}
          disabled={!isFormValid || loading}
          onClick={handlePlaceOrder}
        >
          {loading ? "PROCESSING..." : isFormValid ? "CONFIRM ORDER" : "PLEASE FILL ALL DETAILS"}
        </button>
      </div>
    </div>
  );
}