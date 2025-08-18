
"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot, writeBatch, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-provider";
import type { Transaction, User } from "@/lib/types";

interface WalletState {
  funds: number;
  diamonds: number;
  matchesWon: number;
  transactions: Transaction[];
  loading: boolean;
  depositFunds: (amount: number, paymentId: string) => Promise<void>;
  withdrawDiamonds: (amount: number, accountNumber: string) => Promise<void>;
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
    if (!user) {
      setLoading(false);
      setFunds(0);
      setDiamonds(0);
      setMatchesWon(0);
      setTransactions([]);
      return;
    };

    setLoading(true);
    // Set up a real-time listener for the user's document
    const userRef = doc(db, "users", user.id);
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data() as User;
        setFunds(userData.funds || 0);
        setDiamonds(userData.winnings || 0);
        setMatchesWon(userData.matchesWon || 0);
      }
      setLoading(false);
    });

    // Set up a real-time listener for transactions
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("userId", "==", user.id));
    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const userTransactions: Transaction[] = [];
      const batch = writeBatch(db);
       let requiresUpdate = false;

      querySnapshot.forEach((docSnap) => {
        const transaction = { id: docSnap.id, ...docSnap.data() } as Transaction;
        userTransactions.push(transaction);

        if (transaction.status === 'approved' && !transaction.processed) {
            requiresUpdate = true;
            const userRef = doc(db, 'users', transaction.userId);

             runTransaction(db, async (t) => {
                const userDoc = await t.get(userRef);
                if (!userDoc.exists()) throw "User document does not exist!";
                
                const userData = userDoc.data() as User;
                let newFunds = userData.funds;
                let newWinnings = userData.winnings;

                if (transaction.type === 'deposit') {
                    newWinnings += transaction.amount;
                } else if (transaction.type === 'withdraw') {
                    newWinnings -= transaction.amount;
                }

                t.update(userRef, { funds: newFunds, winnings: newWinnings });
                t.update(doc(db, 'transactions', transaction.id), { processed: true });
            }).then(() => {
                 toast({
                    title: `Transaction Approved`,
                    description: `Your ${transaction.type} of ${transaction.amount} has been processed.`,
                });
            }).catch(err => {
                console.error("Transaction failed: ", err);
            });
        }
      });
      
      // Sort transactions by date, most recent first
      userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(userTransactions);
    });


    // Cleanup listeners on component unmount
    return () => {
      unsubscribeUser();
      unsubscribeTransactions();
    };
  }, [user, toast]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'processed'>) => {
    if (!user) return null;
    const newTransaction = {
      ...transaction,
      userId: user.id,
      date: new Date().toISOString(),
      processed: false,
    };
    const docRef = await addDoc(collection(db, "transactions"), newTransaction);
    return { id: docRef.id, ...newTransaction } as Transaction;
  }

  const depositFunds = async (amount: number, paymentId: string) => {
    if(!user) return;
     if (amount <= 0 || !paymentId) {
      toast({ variant: "destructive", title: "Deposit Request Failed", description: "Please enter a valid amount and payment ID." });
      return;
    }
    await addTransaction({ type: 'deposit', amount, details: `Payment ID: ${paymentId}`, status: 'pending' });
    toast({
      title: "Deposit Request Submitted",
      description: `Your request for Rs. ${amount} has been sent for verification.`,
    });
  };

  const withdrawDiamonds = async (amount: number, accountNumber: string) => {
    if (!user) return;
    if (amount <= 0) {
       toast({ variant: "destructive", title: "Withdrawal Failed", description: "Please enter a valid amount." });
       return;
    }
    if (amount > diamonds) {
      toast({ variant: "destructive", title: "Withdrawal Failed", description: "Insufficient diamond balance." });
      return;
    }
    
    await addTransaction({ type: 'withdraw', amount, details: accountNumber, status: 'pending' });
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
    
    await addTransaction({ type: 'entry_fee', amount: fee, status: 'approved', processed: true });
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
    
    await addTransaction({ type: 'win', amount: prize, status: 'approved', processed: true });
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
    
    await addTransaction({ type: 'convert', amount, status: 'approved', processed: true });
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
