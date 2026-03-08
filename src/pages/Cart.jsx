import { useContext, useEffect} from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaTrashAlt, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import finallogo from "../assets/finallogo.png"
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";

import "./cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQty, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const baseURL = "https://chocolicious-api.onrender.com";
  // ✅ ADMIN CHECK: Identifying if the logged-in user is an admin
  const isAdmin = Number(localStorage.getItem("isAdmin")) === 1;

  useEffect(() => {
    const loadCartFromDB = async () => {
      if (user?.phone) {
        try {
          const res = await fetch(`${baseURL}/api/cart/get-cart/${user.phone}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          const data = await res.json();
          if (data.success) {
            setCart(data.cart); 
          }
        } catch (err) {
          console.error("Failed to fetch cart from DB", err);
        }
      }
    };
    loadCartFromDB();
  }, [user, setCart]);

  const handleUpdateQty = async (id, change) => {
    const item = cart.find(i => i.id === id);
    const userPhone = localStorage.getItem("userPhone");

    if (!item || !userPhone) return;

    const newQty = item.qty + change;
    if (newQty < 1) return;

    try {
      await fetch(`${baseURL}/api/cart/update-qty`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ 
          phone: userPhone, 
          product_name: item.product_name || item.name, 
          custom_info: item.custom_info || "", 
          newQty: newQty 
        })
      });
      
      updateQty(id, change); 
    } catch (err) {
      console.error("Qty update failed", err);
    }
  };

const handleRemoveItem = async (item) => {
  const userPhone = localStorage.getItem("userPhone");
  
  // Frontend se turant hatao
  removeFromCart(item.id, item.product_name || item.name);

  if (userPhone) {
    try {
      await fetch(`${baseURL}/api/cart/remove`, { // Route check karein
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          phone: userPhone, 
          product_name: item.product_name || item.name
        })
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  }
};;
  const getPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleanPrice = price.replace(/[^\d]/g, "");
    return cleanPrice ? parseInt(cleanPrice) : 0;
  }
  return 0;
};

const total = cart.reduce((sum, item) => {
  return sum + (getPrice(item.price) * item.qty);
}, 0);

  const handleCheckout = () => {
    if (isAdmin) {
        alert("Administrators cannot place orders.");
        return;
    }



    const token = localStorage.getItem("token");
    const totalAmount = total;
    const firstItemName = cart[0]?.product_name || cart[0]?.name;
    const orderName = cart.length > 1 
      ? `${firstItemName} + ${cart.length - 1} more items` 
      : firstItemName;
    const tempOrderId = `CHOC-${Date.now().toString().slice(-6)}`;

    if (!token) {
      alert("Please login to proceed with your order.");
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      localStorage.setItem("orderTotal", totalAmount);
      localStorage.setItem("orderName", orderName);
      localStorage.setItem("tempOrderId", tempOrderId);
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-main-container">
        <Link to="/products" className="back-to-shop">
          <FaArrowLeft /> Continue Shopping
        </Link>
        
        <header className="cart-page-header">
          <h1>Your Sweet Bag</h1>
          <div className="diamond-divider-small">
            <span></span><span></span><span></span><span></span>
          </div>
        </header>

        {cart.length === 0 ? (
          <div className="empty-cart-view">
            <FaShoppingBag className="empty-bag-icon" />
            
            {/* ✅ MODIFIED: Show different messages for Admin vs Customer */}
            {isAdmin ? (
              <>
                <p><b>Management Mode:</b> The shopping bag is empty.</p>
                <Link to="/admin-dashboard" className="primary-checkout-btn" style={{textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '15px 40px'}}>
                    BACK TO DASHBOARD
                </Link>
              </>
            ) : (
              <>
                <p>Your bag is currently empty.</p>
                <Link to="/products" className="primary-checkout-btn" style={{textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '15px 40px'}}>
                    BROWSE PRODUCTS
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              {cart.map((item) => (
                <div key={item.id} className="item-row-card">
                  <div className="item-info">
                    <h3>{item.product_name || item.name}</h3>
                    <div className="item-meta-data">
                      {item.size && <p><b>Size/Weight:</b> {item.size}</p>}
                      {item.hamperDetails && <p className="hamper-detail-text"><b>Items:</b> {item.hamperDetails}</p>}
                      {item.notes && <p className="item-instruction-note"><b>Message/Note:</b> {item.notes}</p>}
                    </div>
                  </div>

                  <div className="item-actions-panel">  
                    <div className="quantity-toggle">
                      <button onClick={() => handleUpdateQty(item.id, -1)} disabled={item.qty <= 1}>-</button>
                      <span className="qty-count">{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item.id, 1)}>+</button>
                    </div>                   
                    <div className="price-breakdown">
                      <p className="item-subtotal">₹{(typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, "")) : item.price) * item.qty}</p>
                      <p className="per-unit">₹{item.price} each</p>
                    </div>

                    <button className="delete-item-btn" onClick={() => handleRemoveItem(item)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="order-summary-box">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="summary-line">
                <span>Delivery</span>
                <span className="calc-text">Calculated next step</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-line total-highlight">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
              
              {/* ✅ MODIFIED: Disable Checkout for Admin */}
              {isAdmin ? (
                <div className="admin-lock-note">
                   <p style={{color: '#d4a373', textAlign: 'center', fontWeight: 'bold'}}>Checkout disabled for Admin</p>
                </div>
              ) : (
                <button className="primary-checkout-btn" onClick={handleCheckout}>
                  PROCEED TO CHECKOUT
                </button>
              )}
              
              <div className="delivery-policy-note">
                <p>⚠️ <b>Notice:</b> Orders must be scheduled at least <b>2 days in advance</b>.</p>
              </div>
            </aside>
          </div>
        )}
      </div>

      <section className="queries-orders-section">
        <h2 className="queries-header">For Queries & Orders</h2>
        <p>Please contact us with your queries or to discuss your requirements.</p>
        <Link to="/contact">
          <button className="contact-btn-mint">CONTACT US</button>
        </Link>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-brand">
              <img src={finallogo} alt="Chocolicious" className="footer-logo" />
              <h3 className="footer-name">Chocolicious</h3>
            </div>
            <div className="footer-links">
              <Link to="/about">OUR STORY</Link>
              <Link to="/products">OUR PRODUCTS</Link>
              <a href="#">PRIVACY POLICY</a>
              <a href="#">COOKIE POLICY</a>
            </div>
          </div>
          <div className="footer-center">
            <p><strong>Registered address:</strong></p>
            <p>GROUND FLOOR, Bhiwandi, Thane, Maharashtra, 400701</p>
            <div className="social-icons">
              <a href="https://instagram.com/chocolicious_official._" target="_blank" rel="noopener noreferrer" className="social-box"><FaInstagram /></a>
              <a href="#" className="social-box"><FaFacebookF /></a>
              <a href="https://wa.me/917770085050" target="_blank" rel="noopener noreferrer" className="social-box"><FaWhatsapp /></a>
              <a href="#" className="social-box"><FaYoutube /></a>
            </div>
          </div>
          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>📞 +91 77700 85050</p>
            <p>💌 contact@chocolicious.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}