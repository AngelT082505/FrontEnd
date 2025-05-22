import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    userRole: localStorage.getItem("userRole") || null,
  });

  const login = ({ token, userId, userRole }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", userRole);
    setAuth({ token, userId, userRole });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setAuth({ token: null, userId: null, userRole: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
