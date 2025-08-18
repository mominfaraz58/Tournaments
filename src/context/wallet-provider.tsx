
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
  shareDiamonds: (recipientMobileNo: string, amount: number) => Promise<void>;
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
      
      querySnapshot.forEach((docSnap) => {
        const transaction = { id: docSnap.id, ...docSnap.data() } as Transaction;
        userTransactions.push(transaction);

        if ((transaction.status === 'approved' || transaction.status === 'Approve') && !transaction.processed) {
            const userRef = doc(db, 'users', transaction.userId);

             runTransaction(db, async (t) => {
                const userDoc = await t.get(userRef);
                if (!userDoc.exists()) throw "User document does not exist!";
                
                const userData = userDoc.data() as User;
                let newFunds = userData.funds;
                let newWinnings = userData.winnings;

                if (transaction.type === 'deposit') {
                    newFunds += transaction.amount;
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
                 toast({
                    variant: "destructive",
                    title: `Transaction Failed`,
                    description: `Could not process your ${transaction.type} of ${transaction.amount}.`,
                });
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

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'processed'>) => {
    if (!user) return null;
    const newTransaction = {
      ...transaction,
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
    await addTransaction({ userId: user.id, type: 'deposit', amount, details: `Payment ID: ${paymentId}`, status: 'pending' });
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
    
    await addTransaction({ userId: user.id, type: 'withdraw', amount, details: accountNumber, status: 'pending' });
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
    
    await addTransaction({ userId: user.id, type: 'entry_fee', amount: fee, status: 'approved', processed: true });
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
    
    await addTransaction({ userId: user.id, type: 'win', amount: prize, status: 'approved', processed: true });
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
    
    await addTransaction({ userId: user.id, type: 'convert', amount, status: 'approved', processed: true });
    toast({
      title: "Conversion Successful",
      description: `${amount} diamonds have been converted to your deposit balance.`,
    });
  };

   const shareDiamonds = async (recipientMobileNo: string, amount: number) => {
    if (!user) return;
    const fullMobileNo = `+92${recipientMobileNo}`;

    if (amount <= 0) {
      toast({ variant: "destructive", title: "Transfer Failed", description: "Please enter a valid amount." });
      return;
    }
    if (amount > diamonds) {
      toast({ variant: "destructive", title: "Transfer Failed", description: "Insufficient winning balance." });
      return;
    }
     if (fullMobileNo === user.mobileNo) {
      toast({ variant: "destructive", title: "Transfer Failed", description: "You cannot send diamonds to yourself." });
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("mobileNo", "==", fullMobileNo));
        const recipientSnapshot = await getDocs(q);

        if (recipientSnapshot.empty) {
          throw new Error("Recipient not found.");
        }

        const recipientDoc = recipientSnapshot.docs[0];
        const recipient = { id: recipientDoc.id, ...recipientDoc.data() } as User;
        const recipientRef = doc(db, "users", recipient.id);

        const senderRef = doc(db, "users", user.id);
        const senderDoc = await transaction.get(senderRef);
        if (!senderDoc.exists()) {
            throw new Error("Sender not found");
        }
        const senderData = senderDoc.data() as User;
        
        if (senderData.winnings < amount) {
             throw new Error("Insufficient winning balance.");
        }

        // Deduct from sender
        transaction.update(senderRef, { winnings: senderData.winnings - amount });
        
        // Add to recipient
        transaction.update(recipientRef, { winnings: recipient.winnings + amount });

        // Log transactions for both users
        const transactionsCollection = collection(db, 'transactions');
        const timestamp = new Date().toISOString();

        // Sender's transaction log
        transaction.set(doc(transactionsCollection), {
            userId: user.id,
            type: 'share_sent',
            amount,
            date: timestamp,
            details: `Sent to ${recipient.fullName} (${recipient.mobileNo})`,
            status: 'approved',
            processed: true
        });

        // Recipient's transaction log
        transaction.set(doc(transactionsCollection), {
            userId: recipient.id,
            type: 'share_received',
            amount,
            date: timestamp,
            details: `Received from ${user.fullName} (${user.mobileNo})`,
            status: 'approved',
            processed: true
        });
      });

      toast({
        title: "Transfer Successful",
        description: `${amount} diamonds have been sent to ${fullMobileNo}.`,
      });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: error.message || "An error occurred during the transfer.",
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{ funds, diamonds, matchesWon, transactions, loading, depositFunds, withdrawDiamonds, registerForTournament, addMatchWin, convertWinningsToFunds, shareDiamonds }}
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
