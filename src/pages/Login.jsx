import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaShieldAlt, FaArrowLeft, FaSyncAlt } from "react-icons/fa";
import loginLogo from "../assets/finallogo.png"; 
import "./login.css";

import {auth} from "../firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {
  const generateCaptcha = () => Math.floor(100000 + Math.random() * 900000).toString();
  const [phone, setPhone] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { login } = useContext(AuthContext);
  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());
  const [confirmationResult, setConfirmationResult] = useState(null);
  const baseURL = "https://chocolicious-api.onrender.com";
  const navigate = useNavigate();
  const isPhoneValid = phone.length === 10;
  const isCaptchaValid = captchaInput === generatedCaptcha;
  const isCheckboxValid = acceptedTerms;
  const canProceed = isPhoneValid && isCaptchaValid && isCheckboxValid;
  
  // STRICTOR VALIDATION:
  // 1. Phone must be at least 10 digits
  // 2. Captcha must match exactly
  // 3. Checkbox must be true
  const isSendOtpDisabled = 
    phone.length < 10 || 
    captchaInput !== generatedCaptcha || 
    !acceptedTerms;

    const setupRecaptcha = () => {
    if (auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow OTP send
        }
      });
    }
  };

  const handleSendOTP = async () => {
     try {
      if (!auth) return alert("Firebase not initialized. Check config.");
      setupRecaptcha();
      const phoneNumber = "+91" + phone;
      const appVerifier = window.recaptchaVerifier;
      
      // Firebase Real-Time SMS call
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
    } catch (err) {
      console.error("Full error object:", err);
      alert("Error sending SMS. Check phone number format.");
    }
  };

 const handleVerifyOTP = async () => {
    try {
      // Firebase Verification
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const res = await fetch(`${baseURL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone,firebaseUid: user.uid}),
      });

      const data = await res.json();
      
      if (data.success) {
        // 1. Create the user object from the API response
        const userObj = { 
          phone: data.phone, 
          name: data.name, 
          is_admin: data.is_admin // Ensure your backend sends this!
        };

        // 2. Sync with your AuthContext
        login(userObj); 

        // 3. Save to LocalStorage for persistence and Navbar checks
        localStorage.setItem("token", data.token);
        localStorage.setItem("userPhone", data.phone);
        localStorage.setItem("user", JSON.stringify(userObj));

        alert("Login Successful!");

        // 4. Smart Redirect: If admin, go to Dashboard; if customer, go to Cart
        if (userObj.is_admin === 1 || userObj.is_admin === true) {
          navigate("/admin-dashboard");
        } else {
          navigate("/cart");
        }
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification failed. Please try again.");
    }
  };

  const handleLogin = async () => {
  const res = await fetch(`${baseURL}/api/login`, { /* ... method, body ... */ });
  const data = await res.json();

  if (data.success) {
    // Crucial: Store these three items
    localStorage.setItem("token", data.token); 
    localStorage.setItem("isAdmin", data.user.is_admin); // 1 for Admin, 0 for Customer
    localStorage.setItem("userPhone", data.user.phone);
    
    // Redirect based on role
    if (data.user.is_admin === 1) {
      navigate("/admin-dashboard");
    } else {
      navigate("/products");
    }
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
          <div id="recaptcha-container"></div>
          <div className="form-content">
            {step === 1 ? (
              <div className="form-fade-in">
                <h1>Welcome Back</h1>
                
                <div className="input-group">
                  <label><FaPhoneAlt /> Phone Number</label>
                  <div className="modern-input">
                    <span className="prefix">+91</span>
                    <input 
                      type="tel" 
                      maxLength="10"
                      placeholder="9876543210" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} 
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
                      <button onClick={() => setGeneratedCaptcha(generateCaptcha())}><FaSyncAlt /></button>
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

                {/* The button only becomes "ready" when all 3 conditions are met */}
                <button 
                  className={`submit-btn ${canProceed ? "active-unlocked" : "locked-state"}`}
                  onClick={handleSendOTP}
                  disabled={!canProceed}
                >
                  GET OTP
                </button>
              </div>
            ) : (
               /* Step 2 logic ... */
               <div className="form-wrapper fade-in">
  {/* Back button to return to phone entry */}
  <button className="back-btn-minimal" onClick={() => setStep(1)}>
    <FaArrowLeft /> Edit Number
  </button>
  
  <header className="form-header">
    <h1>Verify Account</h1>
    <p>We've sent a 6-digit code to <span className="highlight-phone">+91 {phone}</span></p>
  </header>

  <div className="input-field">
    <label>Enter Verification Code</label>
    <div className="otp-input-wrapper">
      <input 
        type="text" 
        className="otp-styled-input" 
        maxLength="6" 
        placeholder="· · · · · ·" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
      />
    </div>
  </div>

  <button 
    className={`submit-btn ${otp.length === 6 ? "active-unlocked" : "locked-state"}`}
    onClick={handleVerifyOTP}
    disabled={otp.length !== 6}
  >
    VERIFY & LOGIN
  </button>
  
  <div className="resend-container">
    <p>Didn't receive the code?</p>
    <button className="resend-link" onClick={handleSendOTP}>Resend via SMS</button>
  </div>
</div> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
}