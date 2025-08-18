
"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-provider";
import type { Transaction } from "@/lib/types";

interface WalletState {
  funds: number;
  diamonds: number;
  matchesWon: number;
  transactions: Transaction[];
  loading: boolean;
  depositFunds: (amount: number, paymentId: string) => Promise<void>;
  withdrawDiamonds: (amount: number, gameId: string) => Promise<void>;
  registerForTournament: (fee: number) => Promise<boolean>;
  addMatchWin: (prize: number) => Promise<void>;
  convertWinningsToFunds: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [funds, setFunds] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [matchesWon, setMatchesWon] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) {
        setLoading(false);
        return;
      };
      setLoading(true);
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFunds(userData.funds || 0);
        setDiamonds(userData.winnings || 0);
        setMatchesWon(userData.matchesWon || 0);
      }
      // Fetch transactions if needed, for now we keep it simple
      setLoading(false);
    };

    fetchWalletData();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'date' | 'id'>) => {
    if (!user) return;
    const newTransaction = { 
      ...transaction, 
      date: new Date().toISOString(),
      userId: user.id,
      status: 'pending' // For admin panel review
    };
    await addDoc(collection(db, "transactions"), newTransaction);
    // You might want to update local transaction state as well
  }

  const depositFunds = async (amount: number, paymentId: string) => {
    // This should be an admin-only operation. 
    // The current implementation is for demonstration.
    // In a real app, an admin would verify the payment and then trigger a function to add funds.
    if(!user) return;
    const userRef = doc(db, "users", user.id);
    const newFunds = funds + amount;
    await updateDoc(userRef, { funds: newFunds });
    setFunds(newFunds);
    await addTransaction({ type: 'deposit', amount, details: `Payment ID: ${paymentId}` });
    toast({
      title: "Deposit Request Submitted",
      description: `Your request for Rs. ${amount} has been sent for verification.`,
    });
  };

  const withdrawDiamonds = async (amount: number, gameId: string) => {
    if (!user) return;
    if (amount <= 0) {
       toast({ variant: "destructive", title: "Withdrawal Failed", description: "Please enter a valid amount." });
       return;
    }
    if (amount > diamonds) {
      toast({ variant: "destructive", title: "Withdrawal Failed", description: "Insufficient diamond balance." });
      return;
    }
    
    await addTransaction({ type: 'withdraw', amount, details: gameId });
    // In a real app, the diamond balance would only be updated after admin approval.
    // For now, we'll leave it as an optimistic update locally, but the transaction is logged for admin.
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your request to withdraw ${amount} diamonds has been sent for approval.`,
    });
  };

  const registerForTournament = async (fee: number) => {
    if (!user) return false;
    if (fee > funds) {
      toast({ variant: "destructive", title: "Registration Failed", description: "Insufficient funds in your wallet. Please deposit more funds." });
      return false;
    }
    const userRef = doc(db, "users", user.id);
    const newFunds = funds - fee;
    await updateDoc(userRef, { funds: newFunds });
    setFunds(newFunds);
    await addTransaction({ type: 'entry_fee', amount: fee });
    toast({
      title: "Registration Successful",
      description: `You have been registered. Rs. ${fee} has been deducted from your wallet.`,
    });
    return true;
  };
  
  const addMatchWin = async (prize: number) => {
    // This should also be an admin-only operation
    if(!user) return;
    const userRef = doc(db, "users", user.id);
    const newDiamonds = diamonds + prize;
    const newMatchesWon = matchesWon + 1;
    await updateDoc(userRef, { winnings: newDiamonds, matchesWon: newMatchesWon });
    setDiamonds(newDiamonds);
    setMatchesWon(newMatchesWon);
    await addTransaction({ type: 'win', amount: prize });
    toast({
      title: "Match Won!",
      description: `You won ${prize} diamonds! They have been added to your winning balance.`,
    });
  };

  const convertWinningsToFunds = async (amount: number) => {
     if (!user) return;
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Conversion Failed", description: "Please enter a valid amount." });
      return;
    }
    if (amount > diamonds) {
      toast({ variant: "destructive", title: "Conversion Failed", description: "Insufficient winning balance." });
      return;
    }

    const userRef = doc(db, "users", user.id);
    const newDiamonds = diamonds - amount;
    const newFunds = funds + amount;

    await updateDoc(userRef, { winnings: newDiamonds, funds: newFunds });
    setDiamonds(newDiamonds);
    setFunds(newFunds);

    await addTransaction({ type: 'convert', amount });
    toast({
      title: "Conversion Successful",
      description: `${amount} diamonds have been converted to your deposit balance.`,
    });
  };

  return (
    <WalletContext.Provider
      value={{ funds, diamonds, matchesWon, transactions, loading, depositFunds, withdrawDiamonds, registerForTournament, addMatchWin, convertWinningsToFunds }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
