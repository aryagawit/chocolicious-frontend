import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";
import finallogo from "../assets/finallogo.png";
// 1. RENAME THIS IMPORT (it was clashing with your function name)
import handleImageIcon from "../assets/handleImage.png" 
import "./custom.css";

export default function Customization() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const baseURL = "https://chocolicious-api.onrender.com";
  const [type, setType] = useState("Cake");
  const [weight, setWeight] = useState("1 Kg");
  const [notes, setNotes] = useState("");
  const [balls, setBalls] = useState(5);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [hamperItems, setHamperItems] = useState([]);
  const hamperOptions = [
    { id: "chocolates", label: "Assorted Premium Chocolates", price: 200 },
    { id: "truffles", label: "Luxury Truffles", price: 250 },
    { id: "nuts", label: "Chocolate-Coated Nuts", price: 150 },
    { id: "brownies", label: "Fudge Brownies", price: 200 },
    { id: "cakes", label: "Mini Cakes", price: 300 },
    { id: "cheesecake", label: "Cheesecake Tubs", price: 350 },
    { id: "cupcakes", label: "Assorted Cupcakes", price: 180 },
    { id: "jars", label: "Cake Jars", price: 220 },
    { id: "sweets", label: "Traditional Sweets", price: 200 },
  ];

  const [flavor, setFlavor] = useState("Dutch Chocolate");

const bentoFlavors = [
  "Dutch Chocolate",
  "Chocolate Truffle",
  "Red Velvet",
  "Vanilla Strawberry",
  "Blueberry",
  "Pineapple",
  "Butterscotch"
];

  const confirmAdd = async () => {
    const phone = localStorage.getItem("userPhone");
    
    // 1. Create a clean summary for the DB
    const flavorInfo = type === "Bento Cake" ? `Flavor: ${flavor}, ` : "";
    const customDescription = `${flavorInfo}Size: ${type === "Gift Box" ? `${hamperItems.length} items` : (type === "Cake" ? weight : `${balls} balls`)}, Notes: ${notes}${type === "Gift Box" ? `, Hamper: ${hamperItems.join(", ")}` : ""}`.trim();
    const orderData = {
      id: Date.now(),
      product_name: type === "Gift Box" ? "Custom Hamper" : `Custom ${type}`,
      price: Math.round(finalAmount),
      qty: 1,
      size: type === "Cake" ? weight : type === "Truffle Bouquet" ? `${balls} Balls` : null,
      notes: notes,
      hamperDetails: hamperItems.join(", "),
      custom_info: customDescription,
      image: preview
    };


    // 2. Add to Local Cart UI (React Context)
    addToCart(orderData);

    // 3. Save to Databases
    if (phone && phone !== "null") {
      try {
        // A. Save to Customizations Table (The permanent record)
        await fetch(`${baseURL}/api/customizations/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone,
            order_type: type,
            custom_info: customDescription,
            price: Math.round(finalAmount),
            image_url: preview || null
          }),
        });

        // B. Save to Cart Table (The active basket for +/- logic)
        await fetch(`${baseURL}/api/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          phone: phone,
          product_name: orderData.product_name,
          qty: 1,
          price: orderData.price,
          custom_info: customDescription
        }),
        });

        console.log("✅ Successfully synced customization and cart to DB");
      } catch (err) {
        console.error("❌ Database sync failed:", err);
      }
    } else {
      console.warn("User not logged in. Item only added to temporary local cart.");
    }

    setShowModal(false); 
    navigate("/cart");
  };

  // 2. RESTORE THIS FUNCTION (it was missing/overwritten)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleHamperToggle = (id) => {
    setHamperItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  let finalAmount = 0;
  if (type === "Cake") finalAmount = weight === "1 Kg" ? 500 : 900;
  else if (type === "Bento Cake") finalAmount = 250;
  else if (type === "Truffle Bouquet") finalAmount = balls * 15;
  else if (type === "Gift Box") {
    const baseHamperPrice = 800; 
    const itemsTotal = hamperOptions
      .filter(opt => hamperItems.includes(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
    const totalBeforeDiscount = baseHamperPrice + itemsTotal;
    if (hamperItems.length > 5) finalAmount = totalBeforeDiscount * 0.85;
    else if (hamperItems.length > 2) finalAmount = totalBeforeDiscount * 0.92;
    else finalAmount = totalBeforeDiscount;
  }

  const handleReviewOrder = () => {
    if (!notes.trim()) {
      alert("Please provide the message/instructions. This is compulsory!");
      return;
    }
    if (type === "Gift Box" && hamperItems.length === 0) {
      alert("Please select at least one item for your hamper!");
      return;
    }
    if (finalAmount <= 0) {
      alert("Order total cannot be ₹0.");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="custom-page-wrapper">
      <div className="custom-main-content">
        <header className="custom-header">
          <h1>Customize Your Order</h1>
          <div className="diamond-divider-small"><span></span><span></span><span></span><span></span></div>
        </header>

        <div className="custom-card">
          <div className="form-group">
            <label>Select Category:-</label>
            <select value={type} onChange={(e) => { setType(e.target.value); setPreview(null); }}>
              <option value="Cake">Cake</option>
              <option value="Bento Cake">Bento Cake</option>
              <option value="Truffle Bouquet">Truffle Bouquet</option>
              <option value="Gift Box">Gift Box (Hamper)</option>
            </select>
          </div>

          {type === "Cake" && (
            <div className="form-group">
              <label>Select Weight:-</label>
              <select value={weight} onChange={(e) => setWeight(e.target.value)}>
                <option>1 Kg</option>
                <option>1.5 Kg</option>
                <option>2 Kg</option>
              </select>
            </div>
          )}

          {type === "Bento Cake" && (
            <div className="form-group">
              <label>Select Flavor:-</label>
              <select value={flavor} onChange={(e) => setFlavor(e.target.value)}>
              {bentoFlavors.map((f, index) => (
              <option key={index} value={f}>{f}</option>
              ))}
              </select>
            </div>
          )}

          {type === "Gift Box" && (
            <div className="hamper-checklist">
              <label className="group-label">Build Your Hamper (Select Items):-</label>
              <div className="checklist-grid">
                {hamperOptions.map(opt => (
                  <div key={opt.id} className="check-item">
                    <input 
                      type="checkbox" 
                      id={opt.id} 
                      checked={hamperItems.includes(opt.id)}
                      onChange={() => handleHamperToggle(opt.id)}
                    />
                    <label htmlFor={opt.id}>{opt.label}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "Truffle Bouquet" && (
            <div className="form-group">
              <label>Number of Truffles:-</label>
              <input type="number" min="5" value={balls} onChange={(e) => setBalls(Number(e.target.value))} />
            </div>
          )}

          {/* Hide image for Hamper and Bouquet per your rules */}
          {type !== "Gift Box" && type !== "Truffle Bouquet" && (
            <div className="form-group">
              <label>Reference Image:-</label>
              <input type="file" onChange={handleImage} className="file-input" />
              {preview && <img src={preview} alt="preview" className="preview-img" style={{width: '100px', marginTop: '10px'}} />}
            </div>
          )}

          <div className="form-group">
            <label>
              {type === "Gift Box" ? "Message for the Card:-" : "Special Instructions:-"} 
              <span className="required-star">*</span>
            </label>
            <textarea
              placeholder={type === "Gift Box" ? "Write the message for the card..." : "Instructions, color preferences, etc."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="total-display">
            Total Estimate: <span>₹{Math.round(finalAmount)}</span>
          </div>

          <button className="submit-btn" onClick={handleReviewOrder}>REVIEW ORDER</button>
        </div>
      </div>

      {/* 3. RESTORED MODAL CODE */}
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="order-summary-container">
        <h3>Order Summary</h3>
        <div className="diamond-divider-small">
          <span></span><span></span><span></span><span></span>
        </div>

        {/* Info Section */}
        <div className="order-summary-info">
          <p><b>Type:</b> {type}</p>
          {type === "Bento Cake" && <p><b>Flavor:</b> {flavor}</p>} {/* 👈 Added this */}
          {type === "Cake" && <p><b>Weight:</b> {weight}</p>}
          {type === "Truffle Bouquet" && <p><b>Size:</b> {balls} Balls</p>}
          <p><b>Price:</b> ₹{Math.round(finalAmount)}</p>
        </div>

        {/* Action Section */}
        <div className="modal-actions">
           <button className="submit-btn" onClick={confirmAdd}>CONFIRM & ADD</button>
           <button className="cancel-link" onClick={() => setShowModal(false)}>CANCEL</button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Existing Footer and Sections... */}
      <section className="queries-orders-section">
        <h2 className="queries-header">For Queries & Orders</h2>
        <p>Please contact us with your queries or to discuss your requirements.</p>
        <Link to="/contact">
        <button className="contact-btn-mint">CONTACT US</button>
        </Link>
      </section>


      {/* Footer class */}
      <footer className="footer">
  <div className="footer-container">

    {/* LEFT SECTION */}
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

    {/* CENTER SECTION */}
    <div className="footer-center">
      <p><strong>Registered address:</strong></p>
      <p>
        GROUND FLOOR, Bhiwandi, Thane,
        Maharashtra, 400701
      </p>

      <div className="social-icons">
  <a href="https://instagram.com/chocolicious_official._
" target="_blank"
  rel="noopener noreferrer" className="social-box">
    <FaInstagram />
  </a>

  <a href="#" className="social-box">
    <FaFacebookF />
  </a>

  <a href="https://wa.me/917770085050"
  target="_blank"
  rel="noopener noreferrer" className="social-box">
    <FaWhatsapp />
  </a>

  <a href="#" className="social-box">
    <FaYoutube />
  </a>
</div>
    </div>

    {/* RIGHT SECTION */}
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