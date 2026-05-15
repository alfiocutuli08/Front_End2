import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, isLoggedIn, removeToken } from "./services";
import type { User } from "./types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!isLoggedIn()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.me();
      setUser(data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
