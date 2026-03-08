import React from "react";
import "./about.css";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import finallogo from "../assets/finallogo.png";
import about from "../assets/about.png";
import aboutus from "../assets/aboutus.png";
import heroIllustration from "../assets/brownie.jpg"; // image_049e79.jpg
import teamMember1 from "../assets/ashlesha.png"; 
import teamMember2 from "../assets/arya2.jpg"; // image_04a279.jpg
import harshadImage from "../assets/harshad.jpeg";
const About = () => {
  return (
    <div className="about-page">
      {/* SECTION 1: HERO ILLUSTRATION */}
      <section className="about-hero">
        <h1 className="section-title">About Us</h1>
        <div className="diamond-divider">
          <span></span><span></span><span></span><span></span>
        </div>
        <div className="hero-img-container">
          <img src={aboutus} alt="Shop Illustration" />
        </div>
        <div className="story-text">
          <p>
            Chocolicious reflects our passion for creating "delights for the soul," befitting our exclusive and indulgent range of offerings that include brownies, cheesecakes, artisanal chocolates, and decadent desserts.
          </p>
          <p>
            From our humble beginnings in Bhiwandi, our journey started recently as a dedicated home-based business. 
            What began in a home kitchen with a love for baking has quickly evolved as we share our treats with a growing community of chocolate lovers. 
            While we are still in our early stages, we are growing every day, driven by the joy of delivering handmade, premium sweets straight from our home to yours.
          </p>
        </div>
      </section>

      {/* SECTION 2: OUR PROMISE */}
      <section className="promise-section">
        <h2 className="section-title">Our Promise</h2>
        <div className="diamond-divider">
          <span></span><span></span><span></span><span></span>
        </div>
        <div className="promise-grid">
          <div className="promise-item">
            <div className="promise-icon">🏠</div>
            <h3>HOME-GROWN AUTHENTICITY</h3>
            <p>Every treat is crafted in our Bhiwandi home kitchen, ensuring a genuine, personal touch in every bite.</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">🍫</div>
            <h3>PURE INDULGENCE</h3>
            <p>We use only premium chocolates and the finest ingredients to create desserts that are truly "soul-satisfying."</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">🥣</div>
            <h3>SMALL BATCH QUALITY</h3>
            <p>By baking in small quantities, we maintain strict control over flavor and freshness for every order.</p>
          </div>
          <div className="promise-item">
            <div className="promise-icon">✨</div>
            <h3>MADE TO ORDER</h3>
            <p>Your desserts aren't sitting on a shelf. We start baking only once you order, ensuring maximum freshness.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR TEAM */}
<section className="team-section">
  <h2 className="section-title">MEET THE TEAM</h2>
  <div className="diamond-divider"><span></span><span></span><span></span></div>
  
  <div className="team-grid">
    {/* ASHLESHA - FOUNDER */}
    <div className="team-card">
      <img src={teamMember1} alt="Ashlesha" />
      <div className="team-info">
        <h3>ASHLESHA KENI</h3>
        <p className="designation">CHOCOLICIOUS FOUNDER</p>
        <p className="bio">
          At just 21 years old, our founder turned a weekend passion into a full-time 
          pursuit. What began as baking for fun and sharing treats with friends 
          transformed into the birth of Chocolicious.
        </p>
        <p className="bio">
          With a focus on artisanal quality and home-made warmth, she oversees every 
          batch that leaves the kitchen, ensuring that the "fun" and love she started 
          with is tasted in every single bite.
        </p>
      </div>
    </div>

    {/* HARSHAD - CREATIVE */}
    <div className="team-card">
      <img src={harshadImage} alt="Harshad" /> {/* Replace with your import */}
      <div className="team-info">
        <h3>HARSHAD DANDAWATE</h3>
        <p className="designation">CREATIVE VISIONARY</p>
        <p className="bio">
          The artist behind our aesthetic. From the perfect Instagram reel to every 
          beautifully crafted pamphlet, Harshad turns our chocolate dreams into visual 
          stories that capture the heart of Chocolicious.
        </p>
      </div>
    </div>

    {/* YOU - TECH */}
    <div className="team-card">
      <img src={teamMember2} alt="Developer" /> {/* Replace with your import */}
      <div className="team-info">
        <h3>ARYA GAWIT</h3>
        <p className="designation">DIGITAL ARCHITECT</p>
        <p className="bio">
          The technical backbone of our Command Center. By weaving together the website 
          and database, she ensure's every click is seamless and every order is tracked, 
          turning complex code into a sweet user experience.
        </p>
      </div>
    </div>

    {/* SAI - OPERATIONS */}
    <div className="team-card">
      <img src={harshadImage} alt="Sai" /> {/* Replace with your import */}
      <div className="team-info">
        <h3>SAI KHANDAGALE</h3>
        <p className="designation">OPERATIONS STRATEGIST</p>
        <p className="bio">
          The guardian of our pantry and products. Sai manages the vital data behind 
          our stock and orders, ensuring we never miss a beat—or a Biscoff crumb—in 
          delivering fresh treats to our customers.
        </p>
      </div>
    </div>

    {/* HEMANT - MARKETING */}
    <div className="team-card">
      <img src={harshadImage} alt="Hemant" /> {/* Replace with your import */}
      <div className="team-info">
        <h3>HEMANT PHAPALE</h3>
        <p className="designation">GROWTH CATALYST</p>
        <p className="bio">
          The voice that brings Chocolicious to the world. Hemant designs the strategies 
          that spread the warmth of our brand, connecting our kitchen to dessert lovers 
          far and wide.
        </p>
      </div>
    </div>

    {/* RIYA & OMKAR - FINANCE */}
    <div className="team-card">
      <img src={harshadImage} alt="Finance Team" /> {/* Replace with your import */}
      <div className="team-info">
        <h3>RIYA NADKAR & OMKAR PAWAR</h3>
        <p className="designation">FISCAL NAVIGATORS</p>
        <p className="bio">
          The duo that keeps our passion sustainable. Together, they navigate the numbers, 
          tracking every sale and cost with precision to ensure Chocolicious continues to 
          grow and thrive.
        </p>
      </div>
    </div>
  </div>
</section>
      <section className="cta-section">
  <h2>Like Our Products?</h2>
  <div className="diamond-divider">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
  <p>
    Treat yourself to your favourite Chocolicious products or surprise
    your loved ones with an edible gift.
  </p>

  <Link to="/products" className="cta-btn">
    ORDER ONLINE
  </Link>


</section>
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

export default About;