import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import User from "../data/User";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        credentials: "include",
      });
      if (!response.ok)
        setUser(null);
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUser();
      setIsLoading(false);
    })();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 
