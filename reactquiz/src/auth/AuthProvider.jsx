import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
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

        // Hent navn riktig fra claim
        const name =
          decoded.name ||
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          decoded.sub; // fallback

        setUser({ ...decoded, role, name });
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

    const name =
      decoded.name ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      decoded.sub;

    setUser({ ...decoded, role, name });
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
