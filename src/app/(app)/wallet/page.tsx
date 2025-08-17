"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleDollarSign, Gem, Landmark, Wallet, ShieldCheck, BarChart, History, Repeat, Share2, MessageCircle } from "lucide-react";
import { useWallet } from "@/context/wallet-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const InfoCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
  <Card className="bg-card/80 text-center p-3 flex-1">
    <CardContent className="p-0">
      <Icon className="mx-auto mb-1 h-7 w-7 text-primary" />
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      <div className="flex items-center justify-center gap-1">
        <Gem className="size-4 text-cyan-400"/>
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

const SecondaryButton = ({ label, icon: Icon }: { label: string, icon: React.ElementType }) => (
    <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 rounded-full h-10 flex-1 font-semibold">
        {label}
        <Icon className="ml-2 size-4 text-cyan-400"/>
    </Button>
);

export default function WalletPage() {
  const { funds, diamonds, depositFunds, withdrawDiamonds } = useWallet();
  const [activeTab, setActiveTab] = useState("deposit");
  const [depositType, setDepositType] = useState("paymentId");
  const [paymentId, setPaymentId] = useState("");
  const [addDiamondAmount, setAddDiamondAmount] = useState(100);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <InfoCard title="Deposit Balance" value={funds.toLocaleString()} icon={Landmark} />
        <InfoCard title="Winning Balance" value={diamonds.toLocaleString()} icon={ShieldCheck} />
        <InfoCard title="Exchange Rate" value="1 = 1.0 PK" icon={BarChart} />
      </div>

      <div className="flex gap-2">
        <ActionButton label="Deposit" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} icon={Gem} />
        <ActionButton label="Withdraw" active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} icon={Gem} />
      </div>

       <div className="flex gap-2">
        <SecondaryButton label="History" icon={History} />
        <SecondaryButton label="Convert" icon={Repeat} />
        <SecondaryButton label="Share" icon={Share2} />
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
             
              <Button size="lg" className="w-full bg-foreground text-background font-bold hover:bg-gray-300 h-12">SUBMIT</Button>

               <Link href="https://wa.me/923114714991" target="_blank" rel="noopener noreferrer" className="block w-full">
                 <Button variant="outline" size="lg" className="w-full border-2 border-foreground h-12 font-semibold">
                  <MessageCircle className="mr-2 text-green-500" /> Click Here to Contact Admin
                </Button>
              </Link>
            </div>
          )}
           {activeTab === 'withdraw' && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">WITHDRAW <Gem className="text-cyan-400"/></h2>
               <p className="text-muted-foreground">Withdrawal functionality coming soon!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
