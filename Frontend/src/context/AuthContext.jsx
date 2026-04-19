import { createContext, useState, useEffect } from "react";
import { loginUser, getMe } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // login function
  const login = async (email, password) => {
    const res = await loginUser({ email, password });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // check auth on refresh
  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};