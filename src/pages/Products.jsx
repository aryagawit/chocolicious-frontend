import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./products.css";
import "../styles/home.css";
import { Link } from "react-router-dom";

// Assets imports
import cake from "../assets/cake.jpg";
import brownie from "../assets/brownie.jpg";
import cheesecake from "../assets/cheesecake.jpg";
import biscoffImg from "../assets/biscoff.png";
import oreoImg from "../assets/oreo.png";
import nutellaImg from "../assets/nutella.png";
import blueImg from "../assets/blueberry.png";
import redImg from "../assets/redvelvet.png";
import cupcake from "../assets/cupcake.png";
import milk from "../assets/milkchocolate.png";
import triple from "../assets/chocolates.png";
import dutch from "../assets/dutch.png";
import butterscotch from "../assets/butterscotch.png";
import blackforest from "../assets/blackforest.png";
import vanilla from "../assets/vanilla.png";
import white from "../assets/whitechocolate.png";
import dark from "../assets/darkchocolate.png";
import strawberry from "../assets/strawberry.png";
import og from "../assets/og.png";
import truffleball from "../assets/truffleball.png";
import finallogo from "../assets/finallogo.png";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const descriptions = {
  brownies: "Our brownies are rich, gooey and loaded with chocolate. Perfect for true chocolate lovers.",
  cakes: "Soft, fresh and handcrafted cakes made with premium ingredients.",
  chocolates: "Luxury handmade chocolates crafted in small batches.",
  cupcakes: "Mini delights topped with creamy frosting and love.",
  cheesecakes: "Creamy, rich and handcrafted cheesecakes for every mood."
};

const imageMap = {
  chocolates: og,
  cakes: cake,
  cheesecakes: cheesecake,
  cupcakes: cupcake,
  brownies: brownie,
  truffles: truffleball,
};

const productSpecificImages = {
  1: white, // White Forest Cake
  2: dark,
  3: milk, // Milk Chocolate 
  4: triple, // Triple Chocolate
  5: truffleball, // Chocolate Truffle Balls
  6: truffleball, // Chocolate Truffle Box
  9: dutch, // Dutch Chocolate Cake
  10: dutch, // Dutch Chocolate 
  11: butterscotch, // Butterscotch Cake
  12: butterscotch,
  13: blackforest, // Black Forest Cake
  14: blackforest,
  15: vanilla, // Vanilla Cake
  16: vanilla,
 
  18: biscoffImg,   // Biscoff Cheesecake
  19: oreoImg,      // Oreo Cheesecake
  20: nutellaImg,   // Nutella Cheesecake
  21: blueImg, // Blue Cheesecake
  25: strawberry, // Strawberry Cupcake
  26: strawberry, // Strawberry Cake
  29: redImg, // Red Velvet cupcake
  30: redImg // Red Velvet 
};

// 1. Defined ProductCard OUTSIDE to fix the nesting error
function ProductCard({ p, isAdmin, handleAddToCart, addedItems, activeSidebarSize }) {
  const [selectedSize, setSelectedSize] = useState(activeSidebarSize || "Small");
  useEffect(() => {
    if (activeSidebarSize) {
      setSelectedSize(activeSidebarSize);
    }
  }, [activeSidebarSize]);
  const baseURL = "https://chocolicious-api.onrender.com";
  const isCakery = p.category?.toLowerCase() === 'cakes' || p.category?.toLowerCase() === 'cheesecakes';
  const calculateDisplayPrice = () => {
    const basePrice = Number(p.price);
    if (selectedSize === "Medium") return basePrice + 200;
    if (selectedSize === "Large") return basePrice + 400;
    return basePrice;
  };

  const getProductImage = () => {
  // Check if it's the Biscoff product specifically
  if (productSpecificImages[p.id]) {
    return productSpecificImages[p.id];
  }
  // Fallback to the existing category map or the default logo
  return imageMap[p.category?.toLowerCase()] || og;
};

  return (
    <div className="card">
      <img src={getProductImage()} alt={p.name} />
    <h3>{p.name}</h3>
      <p className="price-tag">₹{calculateDisplayPrice()}</p>
      
      <div className="product-meta" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '8px', 
        margin: '12px 0' 
      }}>
        {p.type === 'eggless' && <span className="badge eggless-badge">Eggless</span>}
        
        {isCakery ? (
          <select 
            className="size-dropdown"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #b38b59',
              fontSize: '0.75rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Small">Small (500g)</option>
            <option value="Medium">Medium (1kg)</option>
            <option value="Large">Large (1.5kg+)</option>
          </select>
        ) : (
          <span className="badge size-badge" style={{ 
            background: '#fdf8f5', 
            color: '#b38b59', 
            fontSize: '0.75rem',
            padding: '4px 10px',
            border: '1px solid #b38b59',
            borderRadius: '4px'
          }}>
            Standard
          </span>
        )}
      </div>

      {!isAdmin ? (
        <button
          className={addedItems[p.id] ? "added-btn" : "add-btn"}
          onClick={() => handleAddToCart({ 
            ...p, 
            price: calculateDisplayPrice(), 
            selectedSize: selectedSize 
          })}
          disabled={addedItems[p.id]}
        >
          {addedItems[p.id] ? "Added to Cart" : "Add to Cart"}
        </button>
      ) : (
        <div className="admin-badge-view" style={{
            marginTop: '10px',
            padding: '8px',
            background: '#f9f5f0',
            color: '#d4a373',
            border: '1px solid #d4a373',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>CATALOG VIEW ONLY</div>
      )}
    </div>
  );
}

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eggFilter, setEggFilter] = useState(null);
  const [category, setCategory] = useState(null);
  const [sizeFilter, setSizeFilter] = useState(null);
  const PRICE_MIN = 100;
  const PRICE_MAX = 7500;
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [addedItems, setAddedItems] = useState({});
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isAdmin = 
    (user && (user.is_admin === 1 || user.is_admin === true)) || 
    localStorage.getItem("isAdmin") === "1" || 
    localStorage.getItem("isAdmin") === "true" ||
    localStorage.getItem("is_admin") === "1";

  useEffect(() => {
    const fetchProducts = async () => {
      const baseURL = "https://chocolicious-api.onrender.com";
      try {
        const res = await fetch(`${baseURL}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || "";
    setSearchQuery(q);
  }, [location.search]);

  const filteredItems = products.filter((p) => {
    const matchEgg = eggFilter ? p.type === eggFilter : true;
    const matchCategory = category ? p.category === category : true;
    const isCakery = p.category?.toLowerCase() === 'cakes' || p.category?.toLowerCase() === 'cheesecakes';
  const matchSize = sizeFilter 
    ? (sizeFilter === "Small" ? true : isCakery) 
    : true;
    const price = parseFloat(p.price);
    const minP = minPrice !== "" && minPrice != null ? parseFloat(minPrice) : PRICE_MIN;
    const maxP = maxPrice !== "" && maxPrice != null ? parseFloat(maxPrice) : Infinity;
    const matchPrice = price >= minP && price <= maxP;
    const matchName = searchQuery ? p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchEgg && matchCategory && matchSize && matchPrice && matchName;
  });

  let displayedItems = filteredItems;
  if (category) {
    displayedItems = [...filteredItems].sort((a, b) => (a.category === category ? 0 : 1) - (b.category === category ? 0 : 1));
  }

  const handleAddToCart = async (p) => {
    if (isAdmin) return; 

    const phone = localStorage.getItem("userPhone");
    addToCart({ 
    ...p, 
    qty: 1, 
    size: p.selectedSize || "Small" 
  });
    addToCart({ ...p, qty: 1 });
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [p.id]: false })), 2000);

    if (phone) {
      const baseURL = "https://chocolicious-api.onrender.com";
      try {
        await fetch(`${baseURL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ phone, product_name: p.name, qty: 1, price: p.price,            // Ye ProductCard se calculate ho kar aayi price hai
          size: p.selectedSize || "Small" }),
        });
      } catch (err) {
        console.error("Cart API Error", err);
      }
    }
  };

  if (loading) return <div className="loading-state">Baking your treats... 🧁</div>;

  return (
    <>
      <section className="products-hero">
        <h2 className="products-title">OUR PRODUCTS</h2>
        <div className="diamond-divider"><span></span><span></span><span></span><span></span></div>
        <p className="products-description">At Chocolicious, we offer a delightful range of sweet treats crafted with love.</p>
      </section>

      <div className="products-page">
        <aside className="sidebar">
          <h3>FILTERS</h3>
          <h4>DIET</h4>
          <label>
            <input type="checkbox" checked={eggFilter === "egg"} onChange={() => setEggFilter(eggFilter === "egg" ? null : "egg")} />
            <span className="checkmark" /> Egg
          </label>
          <label>
            <input type="checkbox" checked={eggFilter === "eggless"} onChange={() => setEggFilter(eggFilter === "eggless" ? null : "eggless")} />
            <span className="checkmark" /> Eggless
          </label>

          <h4>SIZE</h4>
          <label>
            <input type="checkbox" checked={sizeFilter === "Small"} onChange={() => setSizeFilter(sizeFilter === "Small" ? null : "Small")} />
            <span className="checkmark" /> Small / 500g
          </label>
          <label>
            <input type="checkbox" checked={sizeFilter === "Medium"} onChange={() => setSizeFilter(sizeFilter === "Medium" ? null : "Medium")} />
            <span className="checkmark" /> Medium / 1kg
          </label>
          <label>
            <input type="checkbox" checked={sizeFilter === "Large"} onChange={() => setSizeFilter(sizeFilter === "Large" ? null : "Large")} />
            <span className="checkmark" /> Large / 1.5kg+
          </label>

          <h4>PRICE RANGE</h4>
          <div className="price-slider">
            <div className="price-scale">
              <span>₹{PRICE_MIN}</span>
              <span>₹{PRICE_MAX}+</span>
            </div>
            <div className="slider-wrapper dual-slider" style={{
                ['--minPos']: `${((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                ['--maxPos']: `${((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`
            }}>
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50} value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), Number(maxPrice) - 50))} className="range-input range-min" />
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), Number(minPrice) + 50))} className="range-input range-max" />
            </div>
            <div className="price-boxes">
              <div className="price-box">
                <div className="box-label">Minimum</div>
                <input type="number" className="price-input" value={minPrice} onChange={(e) => setMinPrice(Math.max(PRICE_MIN, Math.min(Number(e.target.value), maxPrice - 50)))} />
              </div>
              <div className="price-box">
                <div className="box-label">Maximum</div>
                <input type="number" className="price-input" value={maxPrice} onChange={(e) => setMaxPrice(Math.min(PRICE_MAX, Math.max(Number(e.target.value), minPrice + 50)))} />
              </div>
            </div>
          </div>

          <h4>CATEGORIES</h4>
          <ul className="category-list">
            {Object.keys(descriptions).map(cat => (
              <li key={cat} onClick={() => { setCategory(cat); setSearchQuery(""); navigate('/products'); }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </li>
            ))}
            <li onClick={() => { setCategory(null); setSearchQuery(""); navigate('/products'); }}>All Products</li>
          </ul>
        </aside>

        <main className="product-grid">
          {category && (
            <div className="category-header">
              <h2>{category.toUpperCase()}</h2>
              <p>{descriptions[category]}</p>
            </div>
          )}

          {displayedItems.length === 0 ? (
            <p className="no-products">No yummy treats found! Try changing your filters.</p>
          ) : (
            displayedItems.map((p) => (
              <ProductCard 
                key={p.id} 
                p={p} 
                isAdmin={isAdmin} 
                handleAddToCart={handleAddToCart} 
                addedItems={addedItems} 
                activeSidebarSize={sizeFilter}
              />
            ))
          )}
        </main>
      </div>

      <section className="queries-orders-section">
        <h2 className="queries-header">For Queries & Orders</h2>
        <p>Please contact us with your queries or to discuss your requirements.</p>
        <Link to="/contact"><button className="contact-btn-mint">CONTACT US</button></Link>
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
            </div>
          </div>
          <div className="footer-center">
            <p><strong>Registered address:</strong></p>
            <p>GROUND FLOOR, Bhiwandi, Thane, Maharashtra, 400701</p>
            <div className="social-icons">
              <a href="https://instagram.com/chocolicious_official._" target="_blank" rel="noopener noreferrer" className="social-box"><FaInstagram /></a>
              <a href="https://wa.me/917770085050" target="_blank" rel="noopener noreferrer" className="social-box"><FaWhatsapp /></a>
            </div>
          </div>
          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>📞 +91 77700 85050</p>
          </div>
        </div>
      </footer>
    </>
  );
}