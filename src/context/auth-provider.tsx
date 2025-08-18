
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/lib/types";


interface AuthState {
  user: User | null;
  loading: boolean;
  login: (mobileNo: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'referralCode' | 'winnings' | 'funds' | 'matchesWon'>) => Promise<boolean>;
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
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (mobileNo: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("mobileNo", "==", mobileNo), where("password", "==", password));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        router.push("/tournaments");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed: ", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'referralCode' | 'winnings' | 'funds' | 'matchesWon'>): Promise<boolean> => {
     setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("mobileNo", "==", userData.mobileNo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.error("User with this mobile number already exists.");
        return false;
      }
      
      const q2 = query(usersRef, where("uid", "==", userData.uid));
      const querySnapshot2 = await getDocs(q2);

       if (!querySnapshot2.empty) {
        console.error("User with this UID already exists.");
        return false;
      }

        const newUser: Omit<User, 'id'> = {
            ...userData,
            referralCode: generateReferralCode(),
            winnings: 0,
            funds: 0,
            matchesWon: 0
        };

        const docRef = await addDoc(collection(db, "users"), newUser);
        
        const userWithId = { ...newUser, id: docRef.id };
        setUser(userWithId);
        sessionStorage.setItem("user", JSON.stringify(userWithId));
        router.push("/tournaments");
        return true;
    } catch(e) {
      console.error("Registration failed: ", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
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
