import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { CartContext } from "../context/CartContext"; // 👈 Context import kiya
import finallogo from "../assets/finallogo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // 👈 Cart data access kiya
  const [searchTerm, setSearchTerm] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Badge count calculate karne ke liye
  const cartCount = cart ? cart.reduce((total, item) => total + item.qty, 0) : 0;

  const isAdmin = user && (user.is_admin === 1 || user.is_admin === true);

  useEffect(() => {
    let mounted = true;
    fetch("http://localhost:5050/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setProductsList(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    const onClick = (e) => { 
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setSuggestions([]); 
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    logout()
    navigate("/login");
  };

  const onSearchChange = (v) => {
  setSearchTerm(v);
  if (!v) return setSuggestions([]);

  const q = v.toLowerCase();
  const safeList = Array.isArray(productsList) ? productsList : [];

  const matches = safeList
    .filter(p => p.name && p.name.toLowerCase().includes(q))
    .slice(0, 6);

  setSuggestions(matches);
}

  const onSelectSuggestion = (p) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
  }

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setSuggestions([]);
    navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  }

  return (
    <nav className="navbar">
      <div className="nav-panel" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
        <img src={finallogo} alt="Chocolicious" className="nav-logo" />
        <span className="nav-name">Chocolicious</span>
      </div>

      <div className="nav-search" ref={wrapperRef}>
        <form onSubmit={onSubmitSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </form>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((p) => (
              <li key={p.id || p.name} onClick={() => onSelectSuggestion(p)}>
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        
        {!isAdmin ? (
          <>
            <li><Link to="/custom">Custom</Link></li>
            {/* 🛒 CART WITH NOTIFICATION BADGE */}
            <li style={{ position: 'relative' }}>
              <Link to="/cart">
                Cart
                {cartCount > 0 && (
                  <span className="nav-cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link 
              to="/admin-dashboard" 
              className="admin-link-highlight"
              style={{
                color: '#d4a373', 
                fontWeight: 'bold', 
                border: '1px solid #d4a373', 
                padding: '5px 12px', 
                borderRadius: '4px'
              }}
            >
              DASHBOARD
            </Link>
          </li>
        )}

        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {user ? (
          <li className="profile-item">
            <div className="profile-link">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                 <circle cx="12" cy="7" r="4"></circle>
               </svg>
               {user.name || "Profile"}
            </div>
            <ul className="dropdown">
               <li><Link to="/profile">My Profile</Link></li>
               <li onClick={handleLogout} style={{cursor: 'pointer', color: 'red'}}>Logout</li>
            </ul>
          </li>
        ) : (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}