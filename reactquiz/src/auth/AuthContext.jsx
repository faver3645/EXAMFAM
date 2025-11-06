import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "./AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // sjekk om token er utløpt
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          console.warn("Token expired");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (credentials) => {
  const tokenValue = await authService.login(credentials); // <-- dette er nå string
  localStorage.setItem("token", tokenValue);
  const decodedUser = jwtDecode(tokenValue);
  setUser(decodedUser);
  setToken(tokenValue);
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};