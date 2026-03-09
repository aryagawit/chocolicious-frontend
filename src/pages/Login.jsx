import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaShieldAlt, FaSyncAlt, FaUser } from "react-icons/fa";
import loginLogo from "../assets/finallogo.png"; 
import "./login.css";

export default function Login() {
  const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();
  
  // Toggles between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // New field for Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = "https://chocolicious-api.onrender.com";

  // Validation Logic
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isNameValid = isLogin ? true : name.trim().length > 2;
  const isCaptchaValid = captchaInput === generatedCaptcha;
  const canProceed = isEmailValid && isPasswordValid && isCaptchaValid && isNameValid && acceptedTerms;

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!canProceed) return;

    setLoading(true);
    // Determine which endpoint to hit
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          // Login Success Logic
          login(data.user); 
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("isAdmin", data.user.is_admin ? "true" : "false");
          alert("Login Successful!");

          if (data.user.is_admin === 1 || data.user.is_admin === true) {
            navigate("/admin-dashboard");
          } else {
            navigate("/products");
          }
        } else {
          // Signup Success Logic
          alert("Account created successfully! Please log in.");
          setIsLogin(true); // Switch to login mode
          setGeneratedCaptcha(generateCaptcha());
          setCaptchaInput("");
        }
      } else {
        alert(data.message || "Authentication failed");
        setGeneratedCaptcha(generateCaptcha());
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card">
        <div className="brand-panel">
          <div className="brand-inner">
            <img src={loginLogo} alt="Logo" className="floating-logo" />
            <h2 className="serif-title">Chocolicious</h2>
            <p className="brand-subtitle">Join our sweet community.</p>
          </div>
        </div>

        <div className="form-panel">
          <form className="form-content" onSubmit={handleAuth}>
            <div className="form-fade-in">
              <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
              
              {!isLogin && (
                <div className="input-group">
                  <label><FaUser /> Full Name</label>
                  <div className="modern-input">
                    <input 
                      type="text" 
                      placeholder="Arya Gawit" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label><FaEnvelope /> Email Address</label>
                <div className="modern-input">
                  <input 
                    type="email" 
                    placeholder="admin@chocolicious.in" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label><FaLock /> Password</label>
                <div className="modern-input">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label><FaShieldAlt /> Security Verification</label>
                <div className="captcha-flex">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={captchaInput} 
                    onChange={(e) => setCaptchaInput(e.target.value)} 
                  />
                  <div className="captcha-display">
                    <span className="captcha-code">{generatedCaptcha}</span>
                    <button type="button" onClick={() => setGeneratedCaptcha(generateCaptcha())}>
                      <FaSyncAlt />
                    </button>
                  </div>
                </div>
              </div>

              <div className="terms-row">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptedTerms} 
                  onChange={(e) => setAcceptedTerms(e.target.checked)} 
                />
                <label htmlFor="terms">I agree to the Terms & Privacy Policy</label>
              </div>

              <button 
                type="submit"
                className={`submit-btn ${canProceed && !loading ? "active-unlocked" : "locked-state"}`}
                disabled={!canProceed || loading}
              >
                {loading ? "AUTHENTICATING..." : (isLogin ? "LOGIN" : "SIGN UP")}
              </button>

              <div className="toggle-auth">
                <p>
                  {isLogin ? "New to Chocolicious?" : "Already have an account?"} 
                  <button 
                    type="button" 
                    className="toggle-btn" 
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? " Create Account" : " Login Now"}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}