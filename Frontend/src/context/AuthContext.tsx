import { createContext, useEffect, useState, useContext } from "react";
import { getMe, logoutUser } from "../services/authService";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto login on app load
  const loadUser = async () => {
    try {
      const res = await getMe(); // cookie automatically sent
      setUser(res.data); // ✅ FIXED: no .user
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 custom hook (clean usage)
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};