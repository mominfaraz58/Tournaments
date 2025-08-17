"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleDollarSign, Gem, Landmark, Wallet, ShieldCheck, BarChart, History, Repeat, Share2, MessageCircle, Trophy } from "lucide-react";
import { useWallet } from "@/context/wallet-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const InfoCard = ({ title, value, icon: Icon, valueIcon: ValueIcon }: { title: string, value: string | number, icon: React.ElementType, valueIcon?: React.ElementType }) => (
  <Card className="bg-card/80 text-center p-3 flex-1">
    <CardContent className="p-0">
      <Icon className="mx-auto mb-1 h-7 w-7 text-primary" />
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      <div className="flex items-center justify-center gap-1">
        {ValueIcon && <ValueIcon className="size-4 text-cyan-400"/>}
        <p className="text-lg font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const ActionButton = ({ label, active, onClick, icon: Icon }: { label: string, active: boolean, onClick: () => void, icon?: React.ElementType }) => (
    <Button
        onClick={onClick}
        variant={active ? 'default' : 'secondary'}
        className={cn(
            "w-full font-bold text-base rounded-full shadow-lg h-12 flex-1",
            active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-600 hover:bg-gray-700'
        )}
    >
        {label}
        {Icon && <Icon className="ml-2 size-5 text-cyan-400"/>}
    </Button>
);

const SecondaryButton = ({ label, active, onClick, icon: Icon }: { label: string, active?: boolean, onClick: () => void, icon: React.ElementType }) => (
    <Button 
      variant={active ? 'default' : 'secondary'}
      onClick={onClick}
      className={cn("bg-gray-700 hover:bg-gray-600 rounded-full h-10 flex-1 font-semibold", active && "bg-orange-500 hover:bg-orange-600")}
    >
        {label}
        <Icon className="ml-2 size-4 text-cyan-400"/>
    </Button>
);

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <Image 
          src="https://placehold.co/200x200.png"
          data-ai-hint="empty state illustration"
          alt="No history" 
          width={150} 
          height={150} 
          className="mx-auto mb-4" 
        />
        <p className="text-muted-foreground">Your transaction history is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-bold capitalize">{tx.type}</p>
            <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">ID: {tx.id}</p>
          </div>
          <div className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
            {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()} <Gem className="inline size-4"/>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function WalletPage() {
  const { funds, diamonds, matchesWon, withdrawDiamonds, depositFunds, transactions } = useWallet();
  const [activeTab, setActiveTab] = useState("deposit");
  const [historyFilter, setHistoryFilter] = useState<"deposit" | "withdraw">("deposit");

  const [depositType, setDepositType] = useState("paymentId");
  const [paymentId, setPaymentId] = useState("");
  const [addDiamondAmount, setAddDiamondAmount] = useState(100);

  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [accountNumber, setAccountNumber] = useState("");
  
  const exchangeRate = 1.0;
  const calculatedPk = (withdrawAmount * exchangeRate).toFixed(2);

  const handleWithdraw = () => {
    withdrawDiamonds(withdrawAmount, `acc: ${accountNumber} (${paymentMethod})`);
    setWithdrawAmount(0);
    setAccountNumber("");
  };

  const handleDeposit = () => {
    const amount = depositType === 'addDiamond' ? addDiamondAmount : 100; // Assuming payment ID corresponds to a fixed amount for now
    const id = paymentId || `diamond_${Date.now()}`;
    depositFunds(amount, id);
    setPaymentId("");
  }

  const filteredTransactions = transactions.filter(tx => activeTab === 'history' && tx.type === historyFilter);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <InfoCard title="Deposit Balance" value={funds.toLocaleString()} icon={Landmark} valueIcon={CircleDollarSign} />
        <InfoCard title="Winning Balance" value={diamonds.toLocaleString()} icon={ShieldCheck} valueIcon={Gem} />
        <InfoCard title="Exchange Rate" value="1 = 1.0 PK" icon={BarChart} />
      </div>

      <div className="flex gap-2">
        <ActionButton label="Deposit" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} icon={Gem} />
        <ActionButton label="Withdraw" active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} icon={Gem} />
      </div>

       <div className="flex gap-2">
        <SecondaryButton label="History" icon={History} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <SecondaryButton label="Convert" icon={Repeat} onClick={() => {}}/>
        <SecondaryButton label="Share" icon={Share2} onClick={() => {}}/>
      </div>

      <Card className="bg-card/80 rounded-2xl">
        <CardContent className="p-6">
          {activeTab === 'deposit' && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">DEPOSIT <Gem className="text-cyan-400"/></h2>

              <RadioGroup defaultValue="paymentId" onValueChange={setDepositType} className="flex justify-center gap-6">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paymentId" id="paymentId" />
                    <Label htmlFor="paymentId" className="text-lg">Payment ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="addDiamond" id="addDiamond" />
                    <Label htmlFor="addDiamond" className="text-lg">Add Diamond</Label>
                </div>
              </RadioGroup>

              <Image 
                src="https://placehold.co/300x200.png"
                data-ai-hint="payment illustration"
                alt="Payment"
                width={300}
                height={200}
                className="mx-auto rounded-lg"
              />

              <p className="text-muted-foreground text-sm">
                First, contact the admin and complete your payment. After the payment is made, the admin will provide you with a Payment ID. Enter this Payment ID on the "Deposit <Gem className="inline size-3 text-cyan-400"/>" page. Coins will be credited to your account once the Payment ID is verified and found to be valid.
              </p>

              {depositType === 'paymentId' ? (
                 <Input type="text" placeholder="Payment ID" className="bg-background text-center h-12 text-lg" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
              ) : (
                <Input type="number" placeholder="Enter diamond amount" className="bg-background text-center h-12 text-lg" value={addDiamondAmount} onChange={(e) => setAddDiamondAmount(Number(e.target.value))} />
              )}
             
              <Button size="lg" className="w-full bg-foreground text-background font-bold hover:bg-gray-300 h-12" onClick={handleDeposit}>SUBMIT</Button>

               <Link href="https://wa.me/923114714991" target="_blank" rel="noopener noreferrer" className="block w-full">
                 <Button variant="outline" size="lg" className="w-full border-2 border-foreground h-12 font-semibold">
                  <MessageCircle className="mr-2 text-green-500" /> Click Here to Contact Admin
                </Button>
              </Link>
            </div>
          )}
           {activeTab === 'withdraw' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">WITHDRAW <Gem className="text-cyan-400"/></h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex justify-center gap-6">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa" className="text-lg">Easypaisa</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash" className="text-lg">Jazzcash</Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" type="text" placeholder="e.g. 03123456789" className="bg-background h-12 text-lg" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Amount (Diamonds)</Label>
                <Input id="withdrawAmount" type="number" placeholder="Enter diamond amount" className="bg-background h-12 text-lg" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} />
              </div>
              
              <div className="text-center text-lg">
                You will receive: <span className="font-bold text-primary">Rs. {calculatedPk}</span>
              </div>
             
              <Button size="lg" className="w-full bg-foreground text-background font-bold hover:bg-gray-300 h-12" onClick={handleWithdraw}>SUBMIT WITHDRAWAL</Button>
            </div>
          )}
          {activeTab === 'history' && (
             <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold">Transactions History</h2>
               <div className="flex gap-2">
                <Button 
                  onClick={() => setHistoryFilter('deposit')} 
                  variant={historyFilter === 'deposit' ? 'default' : 'secondary'}
                  className={cn("flex-1 rounded-full", historyFilter === 'deposit' && "bg-orange-500 hover:bg-orange-600")}
                >
                  Deposit
                </Button>
                <Button 
                  onClick={() => setHistoryFilter('withdraw')}
                  variant={historyFilter === 'withdraw' ? 'default' : 'secondary'}
                  className={cn("flex-1 rounded-full", historyFilter === 'withdraw' && "bg-orange-500 hover:bg-orange-600")}
                >
                  Withdraw
                </Button>
              </div>
              <TransactionList transactions={filteredTransactions} />
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
