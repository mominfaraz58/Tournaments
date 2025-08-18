
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  const getAmountColor = (type: string) => {
     switch (type) {
      case 'deposit':
      case 'win':
      case 'convert':
        return 'text-green-500';
      default:
        return 'text-red-500';
    }
  }

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'convert':
        return '+';
      default:
        return '-';
    }
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4 flex justify-between items-center bg-background">
          <div>
            <p className="font-bold capitalize flex items-center gap-2">{tx.type.replace('_', ' ')}</p>
            <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">ID: {tx.id}</p>
          </div>
          <div className="text-right">
             <div className={`font-bold text-lg ${getAmountColor(tx.type)}`}>
              {getAmountPrefix(tx.type)} {tx.amount.toLocaleString()} <Gem className="inline size-4"/>
            </div>
            <p className={`text-sm font-semibold capitalize ${getStatusColor(tx.status)}`}>{tx.status}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function WalletPage() {
  const { funds, diamonds, withdrawDiamonds, depositFunds, transactions, convertWinningsToFunds } = useWallet();
  const [activeTab, setActiveTab] = useState("deposit");

  const [depositAmount, setDepositAmount] = useState(100);
  const [paymentId, setPaymentId] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [accountNumber, setAccountNumber] = useState("");
  
  const [convertAmount, setConvertAmount] = useState(0);

  const exchangeRate = 1.0;
  const calculatedPk = (withdrawAmount * exchangeRate).toFixed(2);

  const handleWithdraw = () => {
    withdrawDiamonds(withdrawAmount, `${paymentMethod}: ${accountNumber}`);
    setWithdrawAmount(0);
    setAccountNumber("");
  };

  const handleDeposit = () => {
    depositFunds(depositAmount, paymentId);
    setDepositAmount(100);
    setPaymentId("");
  }
  
  const handleConvert = () => {
    convertWinningsToFunds(convertAmount);
    setConvertAmount(0);
  };

  return (
    <div className="space-y-4">
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
        <SecondaryButton label="Convert" icon={Repeat} active={activeTab === 'convert'} onClick={() => setActiveTab('convert')}/>
        <SecondaryButton label="Share" icon={Share2} onClick={() => {}}/>
      </div>

      <Card className="bg-card/80 rounded-2xl">
        <CardContent className="p-6">
          {activeTab === 'deposit' && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">DEPOSIT <Gem className="text-cyan-400"/></h2>

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
              
               <div className="space-y-2 text-left">
                <Label htmlFor="depositAmount">Amount (PKR)</Label>
                <Input id="depositAmount" type="number" placeholder="Enter amount" className="bg-background text-center h-12 text-lg" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} />
              </div>
              
               <div className="space-y-2 text-left">
                <Label htmlFor="paymentId">Payment ID</Label>
                <Input id="paymentId" type="text" placeholder="Enter Payment ID from Admin" className="bg-background text-center h-12 text-lg" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
              </div>
             
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
              <TransactionList transactions={transactions} />
             </div>
          )}
          {activeTab === 'convert' && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">Convert Balance</h2>
               <Image 
                src="https://placehold.co/200x150.png"
                data-ai-hint="balance conversion illustration"
                alt="Convert Balance"
                width={200}
                height={150}
                className="mx-auto rounded-lg"
              />
              <p className="text-muted-foreground">
                Convert your winning balance into deposit balance and reuse it to participate in upcoming matches.
              </p>
               <div className="space-y-2 text-left">
                <Label htmlFor="convertAmount" className="text-lg">Enter Amount</Label>
                <Input id="convertAmount" type="number" placeholder="Enter diamond amount" className="bg-background h-12 text-lg" value={convertAmount} onChange={(e) => setConvertAmount(Number(e.target.value))} />
              </div>
              <Button size="lg" className="w-full bg-green-600 text-white font-bold hover:bg-green-700 h-12" onClick={handleConvert}>CONVERT</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
