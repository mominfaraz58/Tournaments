
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

// This is a placeholder for real authentication logic.
// In a real application, you would use a library like NextAuth.js or Firebase Auth.

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (mobileNo: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'referralCode' | 'winnings'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Helper function to generate a random referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (mobileNo: string, password: string): Promise<boolean> => {
    // In a real app, you'd call your API here.
    // We'll simulate by checking localStorage.
    setLoading(true);
    try {
      const storedUsersRaw = localStorage.getItem("users");
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const foundUser = storedUsers.find(
        (u: User) => u.mobileNo === mobileNo && u.password === password
      );
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        router.push("/tournaments");
        return true;
      }
      return false;
    } catch(e) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'referralCode' | 'winnings'>): Promise<boolean> => {
    // In a real app, you'd call your API here.
    // We'll simulate by adding to localStorage.
     setLoading(true);
    try {
        const storedUsersRaw = localStorage.getItem("users");
        const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        
        const existingUser = storedUsers.find((u: User) => u.mobileNo === userData.mobileNo || u.uid === userData.uid);
        if (existingUser) {
            console.error("User with this mobile number or UID already exists.");
            return false;
        }

        const newUser: User = {
            ...userData,
            id: `user_${Date.now()}`,
            referralCode: generateReferralCode(),
            winnings: 0,
        };

        storedUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(storedUsers));
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        router.push("/tournaments");
        return true;
    } catch(e) {
        return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
