import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaPrint, FaHome } from 'react-icons/fa';
import "./receipt.css";

export default function Receipt() {
  const location = useLocation();
  const { id: paramId } = useParams();
  
  // 1. Unified Data Extraction
  const orderData = location.state?.order || location.state || {};
  
  // 2. Normalized Variables - This maps your SQL Aliases to the UI
  const displayId = orderData.orderId || orderData.id || paramId || 0;
  const displayAmount = orderData.amount || orderData.total_amount || "0.00";
  const displayAddress = orderData.address || orderData.delivery_address || "Address provided at checkout";
  const displayDate = orderData.deliveryDate || orderData.order_date;
  const displayItems = orderData.orderName || orderData.product_name || "Chocolate Order";

  // Formats #CHOC-0026 style
  const formattedId = String(displayId).replace(/\D/g, '').padStart(4, '0');

  return (
    <div className="receipt-wrapper">
      <div className="receipt-card">
        <div className="receipt-branding">
          <h1 className="brand-font">Chocolicious</h1>
          <p className="tagline">The Art of Fine Chocolate</p>
          <hr className="branding-divider" />
        </div>

        <div className="success-icon"><FaCheckCircle /></div>
        <h1 className="status-title">Order Placed!</h1>
        <p className="thank-you-text">Thank you for choosing Chocolicious. Your sweets are being prepared with love.</p>

        <div className="receipt-details">
          <div className="receipt-row">
            <span>Order ID:</span>
            <span className="gold-text">#CHOC-{formattedId}</span>
          </div>

          <div className="receipt-row">
            <span>Item Summary:</span>
            <span>{displayItems}</span>
          </div>

          <div className="receipt-row total-row">
            <span>Total Amount:</span>
            <span className="price-text">₹{displayAmount}</span>
          </div>

          <hr className="detail-divider" />

          <div className="receipt-row">
            <span>Delivery Date:</span>
            <strong className="delivery-text">
              {displayDate ? new Date(displayDate).toLocaleDateString('en-IN') : "7/3/2026"}
            </strong>
          </div>

          <div className="receipt-row">
            <span>Delivery To:</span>
            <p className="receipt-address">{orderData.address || orderData.delivery_address || "Address provided at checkout"}

            </p>
          </div>
          
          <div className="payment-tag">PAYMENT ON DELIVERY</div>
        </div>

        <div className="receipt-actions">
          <button onClick={() => window.print()} className="print-btn"><FaPrint /> Print Receipt</button>
          <Link to="/" className="home-btn"><FaHome /> Back to Home</Link>
        </div>
      </div>
    </div>
  );
}