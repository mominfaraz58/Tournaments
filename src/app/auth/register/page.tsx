"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, User, Lock, Phone, Gamepad2, Users, AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  inGameName: z.string().min(3, "In-game name must be at least 3 characters"),
  uid: z.string().min(5, "In-game UID is required"),
  mobileNo: z.string().min(10, "A valid mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  agree: z.boolean().refine(val => val === true, { message: "You must agree to the privacy policy" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      inGameName: "",
      uid: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      agree: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    const { agree, confirmPassword, ...registrationData } = values;
    const success = await register(registrationData);

    if (success) {
      toast({ title: "Registration Successful", description: "Your account has been created." });
    } else {
      setError("Registration failed. A user with this mobile or UID may already exist.");
    }
  };


  return (
    <div className="text-center text-foreground space-y-6">
      <div className="inline-block bg-primary/20 p-4 rounded-full">
        <UserPlus className="size-12 text-primary" />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-orange-500">Register</h1>
        <p className="text-muted-foreground">Please sign up to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
           <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input placeholder="Full Name" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="inGameName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input placeholder="In-Game Name" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uid"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input placeholder="In-Game UID" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 pl-3 pr-2 flex items-center pointer-events-none">
                       <span className="text-muted-foreground">+92</span>
                    </div>
                    <Input placeholder="Mobile No." className="pl-12 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input type="password" placeholder="Password" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input type="password" placeholder="Confirm Password" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input placeholder="Refer code (Optional)" className="pl-10 h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am agree with privacy policies.
                  </FormLabel>
                   <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {error && (
              <Alert variant="destructive">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

          <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-lg font-bold">
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <Link href="/auth/login">
        <Button variant="outline" className="w-full h-12 text-lg font-bold">
          Already have an Account
        </Button>
      </Link>
    </div>
  );
}
