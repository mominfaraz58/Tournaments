"use client";

import React, { useState } from "react";
import { CircleDollarSign, Gem, Landmark } from "lucide-react";
import { useWallet } from "@/context/wallet-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WalletPage() {
  const { funds, diamonds, depositFunds, withdrawDiamonds } = useWallet();
  const [depositAmount, setDepositAmount] = useState(1000);
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [gameId, setGameId] = useState("");

  const handleDeposit = () => {
    depositFunds(depositAmount);
  };

  const handleWithdraw = () => {
    withdrawDiamonds(withdrawAmount, gameId);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-background to-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-headline">
            <Landmark className="size-8 text-primary" />
            <span>Fund Balance</span>
          </CardTitle>
          <CardDescription>Your available funds for tournament entry.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-6">Rs. {funds.toLocaleString()}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full font-bold">Deposit Funds</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
                <DialogDescription>
                  Enter the amount you want to deposit into your wallet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deposit-amount" className="text-right">Amount</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleDeposit}>Confirm Deposit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-headline">
            <Gem className="size-8 text-accent" />
            <span>Diamond Winnings</span>
          </CardTitle>
          <CardDescription>Your diamond balance from tournament victories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-6">{diamonds.toLocaleString()}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="destructive" className="w-full font-bold">Withdraw Diamonds</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Withdraw Diamonds</DialogTitle>
                <DialogDescription>
                  Enter your Game ID and the amount of diamonds to withdraw.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="game-id" className="text-right">Game ID</Label>
                  <Input
                    id="game-id"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="withdraw-amount" className="text-right">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" type="submit" onClick={handleWithdraw}>Confirm Withdrawal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
