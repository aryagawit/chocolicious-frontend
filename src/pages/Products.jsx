import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./products.css";
import "../styles/home.css";
import { Link } from "react-router-dom";

// Assets imports (Keep all your existing imports)
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
  1: white, 2: dark, 3: milk, 4: triple, 5: truffleball, 6: truffleball,
  9: dutch, 10: dutch, 11: butterscotch, 12: butterscotch, 13: blackforest,
  14: blackforest, 15: vanilla, 16: vanilla, 18: biscoffImg, 19: oreoImg,
  20: nutellaImg, 21: blueImg, 25: strawberry, 26: strawberry, 29: redImg, 30: redImg 
};

function ProductCard({ p, isAdmin, handleAddToCart, addedItems, activeSidebarSize }) {
  const [selectedSize, setSelectedSize] = useState(activeSidebarSize || "Small");
  
  useEffect(() => {
    if (activeSidebarSize) setSelectedSize(activeSidebarSize);
  }, [activeSidebarSize]);

  const isCakery = p.category?.toLowerCase() === 'cakes' || p.category?.toLowerCase() === 'cheesecakes';
  
  const calculateDisplayPrice = () => {
    const basePrice = Number(p.price);
    if (selectedSize === "Medium") return basePrice + 200;
    if (selectedSize === "Large") return basePrice + 400;
    return basePrice;
  };

  const getProductImage = () => {
    if (productSpecificImages[p.id]) return productSpecificImages[p.id];
    return imageMap[p.category?.toLowerCase()] || og;
  };

  return (
    <div className="card">
      <img src={getProductImage()} alt={p.name} />
      <h3>{p.name}</h3>
      <p className="price-tag">₹{calculateDisplayPrice()}</p>
      
      <div className="product-meta" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
        {p.type === 'eggless' && <span className="badge eggless-badge">Eggless</span>}
        {isCakery ? (
          <select 
            className="size-dropdown"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="Small">Small (500g)</option>
            <option value="Medium">Medium (1kg)</option>
            <option value="Large">Large (1.5kg+)</option>
          </select>
        ) : (
          <span className="badge size-badge">Standard</span>
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
        <div className="admin-badge-view">CATALOG VIEW ONLY</div>
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
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(7500);
  const [addedItems, setAddedItems] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const baseURL = "https://chocolicious-api.onrender.com";

  // Updated Admin Logic to match new Auth
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  useEffect(() => {
    const fetchProducts = async () => {
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
    setSearchQuery(params.get('q') || "");
  }, [location.search]);

  const filteredItems = products.filter((p) => {
    const matchEgg = eggFilter ? p.type === eggFilter : true;
    const matchCategory = category ? p.category === category : true;
    const price = parseFloat(p.price);
    const matchPrice = price >= minPrice && price <= maxPrice;
    const matchName = searchQuery ? p.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchEgg && matchCategory && matchPrice && matchName;
  });

  const handleAddToCart = async (p) => {
    if (isAdmin) return; 

    // Use user.phone or user.id from AuthContext
    const userPhone = user?.phone || localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    // Update Local Cart State
    addToCart({ 
      ...p, 
      qty: 1, 
      size: p.selectedSize || "Small" 
    });

    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [p.id]: false })), 2000);

    // Sync with Database
    if (userPhone && token) {
      try {
        await fetch(`${baseURL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            phone: userPhone, 
            product_name: p.name, 
            qty: 1, 
            price: p.price,
            size: p.selectedSize || "Small" 
          }),
        });
      } catch (err) {
        console.error("Cart API Sync Error", err);
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
          {/* Diet Filters */}
          <h4>DIET</h4>
          <label><input type="checkbox" checked={eggFilter === "egg"} onChange={() => setEggFilter(eggFilter === "egg" ? null : "egg")} /> Egg</label>
          <label><input type="checkbox" checked={eggFilter === "eggless"} onChange={() => setEggFilter(eggFilter === "eggless" ? null : "eggless")} /> Eggless</label>

          {/* Size Filters */}
          <h4>SIZE</h4>
          <label><input type="checkbox" checked={sizeFilter === "Small"} onChange={() => setSizeFilter(sizeFilter === "Small" ? null : "Small")} /> Small / 500g</label>
          <label><input type="checkbox" checked={sizeFilter === "Medium"} onChange={() => setSizeFilter(sizeFilter === "Medium" ? null : "Medium")} /> Medium / 1kg</label>
          <label><input type="checkbox" checked={sizeFilter === "Large"} onChange={() => setSizeFilter(sizeFilter === "Large" ? null : "Large")} /> Large / 1.5kg+</label>

          {/* Categories */}
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

          {filteredItems.length === 0 ? (
            <p className="no-products">No yummy treats found! Try changing your filters.</p>
          ) : (
            filteredItems.map((p) => (
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
      
      {/* Footer and Query Section remain identical */}
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
          </div>
          <div className="footer-center">
            <p><strong>Registered address:</strong></p>
            <p>GROUND FLOOR, Bhiwandi, Thane, Maharashtra, 400701</p>
            <div className="social-icons">
              <a href="https://instagram.com/chocolicious_official._" target="_blank" className="social-box"><FaInstagram /></a>
              <a href="https://wa.me/917770085050" target="_blank" className="social-box"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}