import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // <-- Riktig
import { AuthContext } from "./AuthContext";
import * as AuthService from "./AuthService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role =
          decoded.role ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ ...decoded, role });
        } else {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (credentials) => {
    const jwtToken = await AuthService.login(credentials);
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    const decoded = jwtDecode(jwtToken);
    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    setUser({ ...decoded, role });
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
