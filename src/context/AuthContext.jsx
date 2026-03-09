import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Auth recovery failed:", err);
        // Clear everything if the data is corrupted
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Explicitly set isAdmin for easy access in non-context components
    localStorage.setItem("isAdmin", userData.is_admin ? "true" : "false");
    if (userData.phone) {
      localStorage.setItem("userPhone", userData.phone);
    }
  };

  const logout = () => {
    setUser(null);
    // Standard practice: Clear all auth-related storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userPhone");
    
    // Optional: If you want a full reset
    // localStorage.clear(); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}