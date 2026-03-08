import "../styles/home.css";
import { useState, useEffect } from "react";
import cake from "../assets/cake.jpg";
import cheesecake from "../assets/cheesecake.jpg";
import cupcake from "../assets/cupcake.png";
import brownie from "../assets/brownie.jpg";
import hamper from "../assets/hamper.jpg";
import logo from "../assets/logo.png";
import chocolates from "../assets/chocolates.png";
import bg1 from "../assets/bg1.png";
import cheesebg from "../assets/cheesebg.png";
import testi from '../assets/testi.png'
import nutella from "../assets/nutella.png";
import blackforest from "../assets/blackforest.png";
import dessertvideo from "../assets/dessertvideo.mp4"
import { Link } from "react-router-dom";
import beige from "../assets/beigebg.png";
import finallogo from "../assets/finallogo.png";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function Home() {
  const slides = [
     {
      title: "Fresh Cakes & Desserts Delivered Daily",
      text: "PREMIUM HANDCRAFTED DESSERTS MADE WITH LOVE 🍫",
      bg: bg1, 
      btn: "Shop Now",
    },
    {
      title: "Slice into endless cheesecake delight!",
      text: "SWEET GIFTS FOR YOUR SPECIAL SOMEONE ❤️",
      bg: cheesebg,
      btn: "Order Now",
    }
  ];

  const [index, setIndex] = useState(0);



  // auto slide every 4 seconds
  useEffect(() => {
  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(timer);
}, []);

  const products = [
    { img: cake, name: "Chocolate Cake", price: "₹500" },
    { img: cheesecake, name: "Cheesecake", price: "₹400" },
    { img: chocolates, name: "Chocolates", price: "₹300" },
    { img: brownie, name: "Brownies", price: "₹350" },
  ];

  const testimonials = [
  {
    text: "Best cakes I’ve ever had! Super fresh and beautiful.",
    author: "– Aditi"
  },
  {
    text: "Delivery was quick and the taste was amazing!",
    author: "– Arya"
  },
  {
    text: "Perfect for gifting. Everyone loved it ❤️",
    author: "– Sneha"
  }
];
const [testimonialIndex, setTestimonialIndex] = useState(0);

const nextSlide = () => {
  setTestimonialIndex(
    (prev) => (prev + 1) % testimonials.length
  );
};

const prevSlide = () => {
  setTestimonialIndex(
    (prev) =>
      (prev - 1 + testimonials.length) %
      testimonials.length
  );
};



  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
        backgroundImage: `url(${slides[index].bg})`
}}      />
        <div className="hero-content">
          <div className="hero-text">
            <h1>{slides[index].title}</h1>
            <p>{slides[index].text}</p>
            <Link to="/products">
            <button className="primary-btn">
              {slides[index].btn}
            </button> </Link>
          </div>
          </div>
      </section>


<section className="brand-section">
  <h2 className="brand-title">Made with Love, Wrapped with Care!</h2>
<div className="diamond-divider">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
  <p className="brand-subtitle">
    We've been serving our guests the best quality treats,
    traditionally made and presented with care.
  </p>

  <div className="brand-grid">

    <div className="brand-col">
        <div className="brand-1">
      <h3>AUTHENTIC RECIPES</h3></div>
      <p>
        Our products are based on traditional home-style recipes
        using fresh ingredients.
      </p>
        <div className="brand-2">
      <h3>BAKED WITH LOVE</h3></div>
      <p>
        Our passion for baking is poured into every recipe,
        serving smiles on a plate everyday.
      </p>
    </div>

    <div className="brand-center">
      <img src={logo} alt="bakery illustration" className="brand-logo" />

    </div>

    <div className="brand-col">
      <div className="brand-3"><h3>COMMITTED TO QUALITY</h3> </div >
      <p>
        From our ingredients to our kitchen operations & guest services,
        we always prioritize quality.
      </p>
        <div className="brand-4">
      <h3>HONESTLY PRICED</h3> </div>
      <p>
        We constantly strive to offer the best products
        at the right prices.
      </p>
    </div>

  </div>
  <Link to="/about">
  <button className="brand-btn">Know More</button></Link>
</section>

{/* FEATURED COLLECTION */}
{/*<section className="featured">
    <h2>Featured Collection</h2>
    <p>Our most loved desserts curated for sweet moments</p>
</section>

    <section className="products">
    {products.map((p, i) => (
        <div key={i} className="card">
        <img src={p.img} alt={p.name} />
        <h3>{p.name}</h3>
        <p>{p.price}</p>
        <button>Add to Cart</button>
      </div>
    ))}
    </section> */}

<section className="products-section">
  <div className="products-header">
    <h2>OUR PRODUCTS</h2>
  <div className="diamond-divider">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div> 
</div>
  <div className="products-grid">
    <div className="product-card">
      <img src={blackforest} alt="Cakes" />
      <p>Cakes</p>
    </div>

    <div className="product-card">
      <img src={brownie} alt="Brownies" />
      <p>Brownies</p>
    </div>

    <div className="product-card">
      <img src={cupcake} alt="Desserts" />
      <p>Desserts & Cupcakes</p>
    </div>

    <div className="product-card">
      <img src={nutella} alt="Cheesecakes" />
      <p>Cheesecakes</p>
    </div>
  </div>
  <Link to="/products">
  <button className="view-all-btn">VIEW ALL</button>
  </Link>
</section>

<section className="gift-section">
  <div className="gift-text">
    <h2>Packed with love & all your favourites!</h2>
    <div className="diamond-divider1">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
    <p>
      Now gift your loved ones our special hampers curated with our
      signature products.
    </p>
    <Link to="/custom"><button className="gift-btn">KNOW MORE</button></Link>
  </div>

  <div className="gift-image">
    <img src={hamper} alt="Gift Hamper" />
  </div>
</section>

{/* DESSERT FEATURE VIDEO SECTION */}
<section className="dessert-feature">
  <div className="dessert-container">

    <div className="dessert-video">
      <video
        src={dessertvideo}
        autoPlay
        muted
        loop
        playsInline
        className="feature-video"
      />
    </div>

    <div className="dessert-content">
      <h2>Signature Dessert Collection</h2>
      <div className="diamond-divider1">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>

      <p>
        Discover our handcrafted premium desserts made with the finest
        ingredients. From rich chocolate indulgence to delicate
        cheesecakes, every bite is a celebration of sweetness.
      </p>

      <Link to="/products">
        <button className="dessert-btn">KNOW MORE</button>
      </Link>
    </div>

  </div>
</section>

{/* TESTIMONIAL SECTION */}
{/* TESTIMONIAL SECTION */}
<section className="testimonials">

  <h2>Testimonials</h2>
  <div className="diamond-divider">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>

  <div className="quote-mark">❝</div>

  <div className="testimonial-container">

    <div className="cupcake left"></div>

    <button className="arrow" onClick={prevSlide}>‹</button>

    <div className="testimonial-content">
      <p>{testimonials[testimonialIndex].text}</p>
      <h4>{testimonials[testimonialIndex].author}</h4>
    </div>

    <button className="arrow" onClick={nextSlide}>›</button>

    <div className="cupcake right"></div>

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
        <a href="/about">PRIVACY POLICY</a>
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
