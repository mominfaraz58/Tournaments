
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Copy, Gift, UserPlus, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";

const Step = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <div className="flex flex-col items-center gap-2 text-center">
        <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="size-8 text-primary" />
        </div>
        <span className="font-semibold text-xs">{label}</span>
    </div>
);

export default function ReferPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const referralCode = user?.referralCode || "LOADING...";

    const copyToClipboard = () => {
        if (!user) return;
        navigator.clipboard.writeText(user.referralCode);
        toast({
            title: "Copied!",
            description: "Referral code copied to clipboard.",
        });
    };

    return (
        <div className="p-4 space-y-6 text-center">
            <Card className="bg-transparent border-0 shadow-none">
                <CardHeader>
                    <h1 className="text-4xl font-headline">REFER & EARN</h1>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Image
                        src="https://placehold.co/300x150.png"
                        data-ai-hint="friends sharing referral"
                        alt="Refer and Earn"
                        width={300}
                        height={150}
                        className="mx-auto"
                    />
                    <h2 className="text-2xl font-bold">Refer More to Earn More! ✌️</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Invite your friends on App using your Referral Code to Earn Coins as Referral reward when they join first paid match. Your referred Friends also get some coins as reward.
                    </p>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">YOUR REFERRAL CODE</h3>
                        <div className="inline-flex items-center gap-2 bg-muted p-2 px-4 rounded-lg border-2 border-dashed border-primary">
                            <span className="text-2xl font-bold tracking-widest">{referralCode}</span>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!user}>
                                <Copy className="size-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">♦ HOW DOES REFER WORK? ♦</h3>
                        <div className="flex justify-around items-start">
                           <Step icon={UserPlus} label="User Register"/>
                           <ArrowRight className="text-primary size-8 mt-5" />
                           <Step icon={Gift} label="Join Match"/>
                           <ArrowRight className="text-primary size-8 mt-5" />
                           <Step icon={Trophy} label="Get Reward"/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 max-w-xs mx-auto">
                        <Button size="lg" className="w-full font-bold bg-white text-black hover:bg-gray-200">REFER NOW</Button>
                        <Button size="lg" className="w-full font-bold bg-green-600 hover:bg-green-700">REFER LIST</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
