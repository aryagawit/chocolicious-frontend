import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Customization from "./pages/Customization";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Receipt from "./pages/Receipt"
import Signup from "./pages/Signup";
import { Navigate, Outlet } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard"; // Adjust path if needed
//import InventoryManager from "./pages/InventoryManager"; // Adjust path if needed


// 1. Protection Wrapper
const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Assuming you store user object
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/custom" element={<Customization />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/checkout" element={  <Checkout /> }/>
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
    
  );
}

export default App;
