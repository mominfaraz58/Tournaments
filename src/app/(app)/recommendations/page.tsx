"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bot, CircleDollarSign, Gem, Info, Percent, Sparkles, Trophy } from "lucide-react";

import { useWallet } from "@/context/wallet-provider";
import { getRecommendationsAction } from "@/app/actions/recommendations";
import type { TournamentRecommendationsOutput } from "@/ai/flows/tournament-recommendations";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  skillLevel: z.string().min(1, "Skill level is required."),
  pastPerformance: z.string().min(10, "Please provide more details about your performance."),
  preferences: z.string().min(10, "Please provide more details about your preferences."),
  currentBalance: z.coerce.number().min(0),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold" size="lg">
      {pending ? "Analyzing..." : "Get Recommendations"}
      <Sparkles className="ml-2 size-5" />
    </Button>
  );
}

function RecommendationList({ recommendations }: { recommendations: TournamentRecommendationsOutput['recommendations'] }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-headline text-center">Your Personalized Recommendations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Trophy className="text-primary"/>{rec.tournamentName}</CardTitle>
              <CardDescription>{rec.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="flex justify-around items-center text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Entry Fee</div>
                  <div className="flex items-center gap-1 font-bold"><CircleDollarSign className="size-4"/>{rec.entryFee}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Prize Pool</div>
                  <div className="flex items-center gap-1 font-bold text-primary"><Gem className="size-4"/>{rec.prizePool}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Win Chance</div>
                  <div className="flex items-center gap-1 font-bold text-accent"><Percent className="size-4"/>{(rec.estimatedWinningProbability * 100).toFixed(0)}%</div>
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Why this tournament?</AlertTitle>
                <AlertDescription>{rec.reason}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const { funds } = useWallet();
  const [state, formAction] = useFormState(getRecommendationsAction, { recommendations: [], error: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillLevel: "",
      pastPerformance: "Average Win/Loss ratio of 1.5, usually place in top 10.",
      preferences: "Prefer squad battles with larger prize pools. Not interested in solo duels.",
      currentBalance: funds,
    },
  });

  return (
    <div className="space-y-12">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Find Your Next Victory</CardTitle>
            <CardDescription>
              Tell us about your play style, and our AI will recommend the perfect tournaments for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your skill level" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Wallet Balance (Rs.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pastPerformance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Performance</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Win/loss ratio, average ranking, notable achievements..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Preferred game modes, tournament formats, prize pool sizes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {state.error && (
              <Alert variant="destructive">
                <Bot className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <RecommendationList recommendations={state.recommendations} />
    </div>
  );
}
