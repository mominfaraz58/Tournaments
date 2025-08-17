"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletState {
  funds: number;
  diamonds: number;
  matchesWon: number;
  depositFunds: (amount: number) => void;
  withdrawDiamonds: (amount: number, gameId: string) => void;
  registerForTournament: (fee: number) => boolean;
  addMatchWin: (prize: number) => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [funds, setFunds] = useState(2000); // Initial funds for demo
  const [diamonds, setDiamonds] = useState(500); // Initial diamonds for demo
  const [matchesWon, setMatchesWon] = useState(5); // Initial matches won for demo
  const { toast } = useToast();

  const depositFunds = (amount: number) => {
    setFunds((prev) => prev + amount);
    toast({
      title: "Deposit Successful",
      description: `Rs. ${amount} has been added to your wallet.`,
    });
  };

  const withdrawDiamonds = (amount: number, gameId: string) => {
    if (amount > diamonds) {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "Insufficient diamond balance.",
      });
      return;
    }
    setDiamonds((prev) => prev - amount);
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

  return (
    <WalletContext.Provider
      value={{ funds, diamonds, matchesWon, depositFunds, withdrawDiamonds, registerForTournament, addMatchWin }}
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
