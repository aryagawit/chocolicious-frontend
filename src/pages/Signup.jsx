import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // Reuse your existing styles

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();
  const baseURL = "https://chocolicious-api.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card">
        <div className="form-panel">
          <form className="form-content" onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Full Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
            <input type="tel" placeholder="Phone (Optional)" onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
            <input type="password" placeholder="Password" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
            <button type="submit" className="submit-btn active-unlocked">SIGN UP</button>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}