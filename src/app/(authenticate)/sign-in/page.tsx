'use client'
import {  useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, LogIn, User, Lock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const signInSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formHook = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsSubmitting(true)
      const response = await signIn("thisCredential", {
        identifier:data.identifier,
        password:data.password,
        redirect:false
      })
      console.log(`this is line 60 at signinpage.tsx`,response)
      if (response?.error) {
        console.log(response.error)
        throw new Error(response.error)
      }
       
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
        variant: "destructive",
        duration:3000,
        className:'bg-gray-500 text-white'
      })

      router.replace('/home')

    } catch (error) {
      console.log("signin error",error)
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-amber-400">Welcome Back</CardTitle>
          <CardDescription className="text-center text-gray-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formHook}>
            <form onSubmit={formHook.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={formHook.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          placeholder="Username or Email"
                          className="pl-10 bg-gray-700 border-gray-600 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={formHook.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10 bg-gray-700 border-gray-600 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </FormItem>
                )}
              /> */}
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/forgot-password" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
            Forgot your password?
          </Link>
          <p className="text-sm text-gray-400">
             Don&apost have an account?{" "}
            <Link href='/sign-up' className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Sign up <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}