"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otpEntered: z.string().min(4, "OTP must be at least 4 digits"),
});

type OTPformValue = z.infer<typeof otpSchema>;

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams(); // Move this to the top level
  const email = params.verifyemail as string; // Ensure this is a string
  const [loading,setLoading]=useState(false)

  const thisForm = useForm<OTPformValue>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otpEntered: "" },
  });

  const handlSubmitfunction = async (data: OTPformValue) => {
      setLoading(true)
    try {
      const paramsData = {
        otp: data.otpEntered, // Fix the key here
        email, // Use email directly
      };

      const response = await axios.put("/api/verify-accountapi", paramsData);

      toast({ description: "Account verified successfully", variant: "default" });
      console.log(`Response from verify user page:`, response);

      setTimeout(() => {
        router.push("/home");   // this will lead u to home page , but as on signup u havnent logged in so secure route but no session , so askks u to sign in
      }, 2000);
    } catch (error) {
      console.log("Verification error:", error);
      console.log('this is the error at line 48 in verify-account',error)

      if (axios.isAxiosError(error) && error.response) {
        toast({ description: error.response.data.message || "Invalid OTP", variant: "destructive" });
      } else {
        toast({ description: "Something went wrong!", variant: "destructive" });
      }

      try {
        const resp = await axios.delete(`/api/deleteUser/${email}`);
        if (resp) {
          toast({ description: "Please try again!", variant: "default",className:"bg-blue-950 text-white" });
          setTimeout(() => router.push("/sign-up"), 2000);
        }
      } catch (deleteError) {
        console.log("Error while deleting user on signup page:", deleteError);
        toast({ description: "Internal Server error", variant: "destructive" });
        router.push("/");
      }
    }
      finally{
        setLoading(false)
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Account</CardTitle>
          <CardDescription className="text-center">Enter the OTP sent to your email or phone</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...thisForm}>
            <form onSubmit={thisForm.handleSubmit(handlSubmitfunction)} className="space-y-4">
              <FormField
                control={thisForm.control}
                name="otpEntered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the OTP"
                        type="text"
                        {...field}
                        className="text-center text-2xl tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading} >
                {loading ? <Loader2 className="animate-spin scroll-smooth">Submitting</Loader2> :"Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Didn't receive the OTP?{" "}
            <a href='#' className="text-blue-600 hover:underline">
              Resend OTP
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPage;
