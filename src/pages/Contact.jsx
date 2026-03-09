import React, { useState } from "react";
import "./contact.css";
import axios from "axios";
import envelopeImg from "../assets/envelope.png";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import finallogo from "../assets/finallogo.png";

const ContactUs = () => {
  // 1. Define the state to hold form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    reqDate: "",
    reqHour: "01",
    reqMin: "00",
    reqAmPm: "AM",
    city: "",
    query: ""
  });

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time for the database
    const fullDateTime = `${formData.reqDate} ${formData.reqHour}:${formData.reqMin} ${formData.reqAmPm}`;

    const submissionData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      mobile: formData.mobile,
      email: formData.email,
      req_date: fullDateTime,
      city: formData.city,
      query_text: formData.query
    };

    try {
      // Replace with your actual Render URL
      const response = await axios.post("https://chocolicious-api.onrender.com/api/contact", submissionData);

      if (response.status === 200) {
        alert("Success! Your query has been sent to Ashlesha. 🧁");
        // Reset form
        setFormData({
          firstName: "", lastName: "", mobile: "", email: "",
          reqDate: "", reqHour: "01", reqMin: "00", reqAmPm: "AM",
          city: "", query: ""
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Oops! Something went wrong. Please try again.");
    }
  };
  return (
    <div className="contact-page-wrapper">
      <div className="contact-main-content">
        <header className="contact-header">
          <h1>Contact Us</h1>
          <div className="diamond-divider-small">
            <span></span><span></span><span></span><span></span>
          </div>
          <p className="contact-subtitle">
            We would love to hear from you. Share your thoughts and queries with us!
          </p>
        </header>

        <div className="contact-container">
          {/* LEFT SIDE: FORM */}
          <div className="contact-form-section">
            <form className="main-contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name:- <span className="required">*</span></label>
                <input type="text" name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-group">
                <label>Last Name:- <span className="required">*</span></label>
                <input type="text" name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-group">
                <label>Mobile:- <span className="required">*</span></label>
                <input type="tel" name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-group">
                <label>Email:- <span className="required">*</span></label>
                <input type="email" name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-group">
                <label>Requirement Date & Time:-</label>
                <div className="datetime-row">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    name="reqDate"
                    value={formData.reqDate}
                    onChange={handleChange}
                  />
                  <select name="reqHour" value={formData.reqHour} onChange={handleChange}>
                    <option>01</option><option>02</option><option>03</option><option>04</option>
                    <option>05</option><option>06</option><option>07</option><option>08</option>
                    <option>09</option><option>10</option><option>11</option><option>12</option>
                  </select>
                  <select name="reqMin" value={formData.reqMin} onChange={handleChange}>
                    <option>00</option><option>15</option><option>30</option><option>45</option>
                  </select>
                  <select name="reqAmPm" value={formData.reqAmPm} onChange={handleChange}>
                    <option>AM</option><option>PM</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>City:- <span className="required">*</span></label>
                <input type="text" name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-group">
                <label>Query:- <span className="required">*</span></label>
                <input type="text" name="query"
                  value={formData.query}
                  onChange={handleChange}
                  required />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">SUBMIT</button>
                <button type="reset" className="reset-btn" onClick={() => setFormData({
                  firstName: "", lastName: "", mobile: "", email: "",
                  reqDate: "", reqHour: "01", reqMin: "00", reqAmPm: "AM",
                  city: "", query: ""
                })}>RESET</button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE: INFO */}
          <div className="contact-info-section">
            <div className="info-decoration">
              <img src={envelopeImg} alt="postcard" />
            </div>

            <div className="info-details">
              <h2 className="company-name">Chocolicious🧁</h2>
              <p className="info-label">Registered Address:</p>
              <address>
                GROUND FLOOR, Bhiwandi, <br />
                Thane,<br />
                Mumbai-400088,<br />
                Maharashtra, India
              </address>

              <p className="info-label">Founder</p>
              <p>Ashlesha Keni</p>

              <p className="info-label">Contact Details:</p>
              <p className="contact-link">📞 +91 7770-085050</p>
              <p className="contact-link">💌 contact@chocolicious.in</p>
            </div>
          </div>
        </div>
      </div>




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
};

export default ContactUs;