"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Loader2, Mail, User, Lock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; 

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>; // this creates a type from the schema

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const formlayout = useForm<SignUpFormValues>({
    //  this says that formalyout expects the data of type SignUpFromValues
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  }); 
  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    const thisEmail=data.email as string
    try {
      const response = await axios.post("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });
      router.push(`/verify-account/${thisEmail}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;;
      console.log("Signup error: at line 70 page sign-up", axiosError);
      const message = axiosError?.response?.data?.message;
      
      toast({
        title: "Error",
        description: message || "An error occurred during signup.",
        variant: "default",
        className:"bg-blue-800 text-white"
       
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to get started with our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formlayout}>
            {" "}
            {/* this is like a wrapper form main form.. sends instance of formlayout to inner form /everyfield */}
            <form
              onSubmit={formlayout.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {" "}
              {/*handlesubmit is existing inside the formlayout, so we call the handlesubmit of formlayouy/*}
            {/* What happens here?
When the user clicks the submit button, handleSubmit(onSubmit) is triggered.
handleSubmit first checks if all inputs are valid (using signUpSchema). using zodResolver
If everything is valid, it calls onSubmit(data) with the form values. */}
              <FormField
                control={formlayout.control}
                // dont know->maps formlayout field to this formfield
                name="name" // does it matter in field?-> yes helps in mapping
                render={(
                  { field } // The render function provides { field }, which contains everything needed to manage this input.
                ) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          placeholder="Enter your name"
                          className="pl-10"
                          {...field}
                        />{" "}
                        {/*  // connects the input to React Hook Form, so it knows when the user types and updates the value. */}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formlayout.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...field}
                        
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formlayout.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          type="password"
                          placeholder="Create a password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
