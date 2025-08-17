"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Transaction } from "@/lib/types";

interface WalletState {
  funds: number;
  diamonds: number;
  matchesWon: number;
  transactions: Transaction[];
  depositFunds: (amount: number, paymentId: string) => void;
  withdrawDiamonds: (amount: number, gameId: string) => void;
  registerForTournament: (fee: number) => boolean;
  addMatchWin: (prize: number) => void;
  convertWinningsToFunds: (amount: number) => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [funds, setFunds] = useState(2000); // Initial funds for demo
  const [diamonds, setDiamonds] = useState(500); // Initial diamonds for demo
  const [matchesWon, setMatchesWon] = useState(5); // Initial matches won for demo
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const addTransaction = (transaction: Omit<Transaction, 'date'>) => {
    const newTransaction = { ...transaction, date: new Date().toISOString() };
    setTransactions(prev => [newTransaction, ...prev]);
    // Here you would typically send the transaction to your backend/admin panel
    console.log("New Transaction to send to admin:", newTransaction);
  }

  const depositFunds = (amount: number, paymentId: string) => {
    setFunds((prev) => prev + amount);
    addTransaction({ id: paymentId, type: 'deposit', amount });
    toast({
      title: "Deposit Successful",
      description: `Rs. ${amount} has been added to your wallet.`,
    });
  };

  const withdrawDiamonds = (amount: number, gameId: string) => {
    if (amount <= 0) {
       toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "Please enter a valid amount.",
      });
      return;
    }
    if (amount > diamonds) {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "Insufficient diamond balance.",
      });
      return;
    }
    setDiamonds((prev) => prev - amount);
    const withdrawalId = `wd_${Date.now()}`;
    addTransaction({ id: withdrawalId, type: 'withdraw', amount, details: gameId });
    toast({
      title: "Withdrawal Successful",
      description: `${amount} diamonds have been sent to Game ID: ${gameId}.`,
    });
  };

  const registerForTournament = (fee: number) => {
    if (fee > funds) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Insufficient funds in your wallet. Please deposit more funds.",
      });
      return false;
    }
    setFunds((prev) => prev - fee);
    toast({
      title: "Registration Successful",
      description: `You have been registered. Rs. ${fee} has been deducted from your wallet.`,
    });
    return true;
  };
  
  const addMatchWin = (prize: number) => {
    setMatchesWon((prev) => prev + 1);
    setDiamonds((prev) => prev + prize);
    toast({
      title: "Match Won!",
      description: `You won ${prize} diamonds! They have been added to your winning balance.`,
    });
  };

  const convertWinningsToFunds = (amount: number) => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "Please enter a valid amount.",
      });
      return;
    }
    if (amount > diamonds) {
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "Insufficient winning balance.",
      });
      return;
    }
    setDiamonds((prev) => prev - amount);
    setFunds((prev) => prev + amount);
    const convertId = `conv_${Date.now()}`;
    addTransaction({ id: convertId, type: 'convert', amount });
    toast({
      title: "Conversion Successful",
      description: `${amount} diamonds have been converted to your deposit balance.`,
    });
  };

  return (
    <WalletContext.Provider
      value={{ funds, diamonds, matchesWon, transactions, depositFunds, withdrawDiamonds, registerForTournament, addMatchWin, convertWinningsToFunds }}
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
