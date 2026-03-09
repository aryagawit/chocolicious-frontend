import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const baseURL = "https://chocolicious-api.onrender.com";

  // 1. Fetch cart on refresh (Auto-Sync with TiDB)
  useEffect(() => {
    const fetchCartFromDB = async () => {
      const phone = localStorage.getItem("userPhone");
      const token = localStorage.getItem("token");

      if (phone && token) {
        try {
          const res = await fetch(`${baseURL}/api/cart/get-cart/${phone}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (data.success) {
            // Mapping TiDB column names to Frontend keys
            setCart(data.cart.map(item => ({
              id: item.id,
              name: item.product_name, 
              price: item.price || 300, 
              qty: item.qty,
              size: item.size || "Small"
            })));
          }
        } catch (err) { 
          console.error("Cart Recovery Error:", err); 
        }
      }
    };
    fetchCartFromDB();
  }, []);

  // 2. Add to Cart Logic (Local + DB Sync)
  const addToCart = async (item) => {
    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    setCart((prev) => {
      const existing = prev.find((p) => p.name === item.name && p.size === item.size);
      if (existing) {
        const updatedQty = existing.qty + 1;
        // Sync increment to DB
        if (phone && token) {
          syncQtyToDB(phone, item.name, updatedQty, token);
        }
        return prev.map((p) => (p.name === item.name && p.size === item.size ? { ...p, qty: updatedQty } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // 3. Helper for DB Qty Sync
  const syncQtyToDB = async (phone, productName, newQty, token) => {
    try {
      await fetch(`${baseURL}/api/cart/update-qty`, { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ phone, product_name: productName, newQty }),
      });
    } catch (err) {
      console.error("DB Sync Error:", err);
    }
  };

  // 4. Remove from Cart
  const removeFromCart = async (productId, productName) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token) {
      try {
        await fetch(`${baseURL}/api/cart/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ phone, product_name: productName }),
        });
      } catch (err) {
        console.error("Delete from DB failed:", err);
      }
    }
  };

  // 5. Update Quantity (Plus/Minus buttons)
  const updateQty = async (id, change, productName) => {
    let finalQty = 1;
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          finalQty = Math.max(1, (Number(item.qty) || 1) + change);
          return { ...item, qty: finalQty };
        }
        return item;
      });
    });

    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token) {
      syncQtyToDB(phone, productName, finalQty, token);
    }
  };

  // 6. Clear Entire Cart (After Checkout)
  const clearCart = async () => {
    setCart([]);
    const phone = localStorage.getItem("userPhone");
    const token = localStorage.getItem("token");

    if (phone && token) {
      try {
        await fetch(`${baseURL}/api/cart/clear/${phone}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to clear DB cart:", err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}