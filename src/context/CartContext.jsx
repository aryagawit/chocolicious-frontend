import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const clearCart = async () => {
  // 1. Clear Local State immediately
  setCart([]);

  // 2. Clear Database
  const phone = localStorage.getItem("userPhone");
  const token = localStorage.getItem("token");

  if (phone && token) {
    try {
      await fetch(`http://localhost:5050/api/cart/clear/${phone}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      console.log("Database cart cleared successfully");
    } catch (err) {
      console.error("Failed to clear database cart:", err);
    }
  }
};

  // 1. Fetch cart on refresh
useEffect(() => {
  const fetchCartFromDB = async () => {
    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token) {
      try {
        const res = await fetch(`http://localhost:5050/api/cart/get-cart/${phone}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          // 💡 Mapping ensures database column 'product_name' matches frontend 'name'
          setCart(data.cart.map(item => ({
            id: item.id,
            name: item.product_name, // Map product_name to name
            price: item.price || 300, // Fallback agar price missing ho
            qty: item.qty
          })));
        }
      } catch (err) { console.error(err); }
    }
  };
  fetchCartFromDB();
}, []);

  // 2. Add to Cart Logic
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) => (p.name === item.name ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // 3. Remove from Cart (The Fix)
  const removeFromCart = async (productId, productName) => {
    // Console check: Dekho kya name database se match karta hai?
    console.log("Attempting to delete:", productName, "for phone:", localStorage.getItem("userPhone"));

    // Instant UI update
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token) {
      try {
        const response = await fetch("http://localhost:5050/api/cart/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            phone: phone, 
            product_name: productName // Database column name match zaroori hai
          }),
        });

        const result = await response.json();
        console.log("Server Response:", result);

        if (!response.ok) {
           console.error("Failed to delete from DB:", result.message);
        }
      } catch (err) {
        console.error("Network error while removing:", err);
      }
    }
  };

  // 4. Update Quantity
  const updateQty = async (id, change, productName) => {
    let newQty = 1;
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          newQty = Math.max(1, (Number(item.qty) || 1) + change);
          return { ...item, qty: newQty };
        }
        return item;
      });
    });

    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token && productName) {
      try {
        await fetch("http://localhost:5050/api/cart/update-qty", { 
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ phone, product_name: productName, newQty: newQty }),
        });
      } catch (err) {
        console.error("Failed to sync quantity:", err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}