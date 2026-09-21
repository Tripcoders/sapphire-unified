import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AgentUser } from "@/lib/auth";

type AuthContextType = {
  user: AgentUser | null;
  login: (user: AgentUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AgentUser | null>(() => {
    const saved = localStorage.getItem("sapphire_user");
    if (saved) try { return JSON.parse(saved); } catch { return null; }
    return null;
  });

  const login = (u: AgentUser) => {
    setUser(u);
    localStorage.setItem("sapphire_user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("sapphire_user");
  };

  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem("sapphire_user");
      if (!saved) setUser(null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
