const items = [
  { name: "Chocolate Cake", price: 500 },
  { name: "Cheesecake", price: 400 },
  { name: "Cupcakes", price: 300 },
  { name: "Brownies", price: 350 },
];

function BestSellers() {
  return (
    <section className="container best">
      <h2>Best Sellers</h2>

      <div className="grid">
        {items.map((item, i) => (
          <div className="card" key={i}>
            <img src="/cake.jpg" alt="" />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BestSellers;
