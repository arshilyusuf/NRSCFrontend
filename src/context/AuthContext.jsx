import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });

  const isAuthenticated = !!auth.token;
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setAuth(JSON.parse(saved));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json(); // contains access, refresh

      // Optional: fetch user info if endpoint exists
      const userResponse = await fetch("http://127.0.0.1:8000/api/user/me/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const user = userResponse.ok ? await userResponse.json() : null;

      const userData = {
        user,
        token: data.access,
      };
      console.log("User data:", userData);
      setAuth(userData);
      localStorage.setItem("auth", JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    window.location.href = "/";
  }; // Redirect to login page};

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
