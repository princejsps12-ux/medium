

// 'use client'

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import { m, motion } from "framer-motion"
// import confetti from "canvas-confetti"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import Script from "next/script"
// import { IndianRupee, Loader2 } from 'lucide-react'
// import { useSession } from "next-auth/react"
// import { toast, useToast } from "@/hooks/use-toast"
// import { set } from "nprogress"
// import { on } from "events"

// export default function Donate() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const currentSession = useSession()
//   const userEmail = currentSession.data?.user?.email
//   const [amountInput, setAmount] = useState<number>(0)
//   const[buttonclicked, setButtonClicked] = useState(false)
//   const[payment, setpayment] = useState(false)
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false)

//   useEffect(() => {
//     const script = document.createElement('script')
//     script.src = "https://checkout.razorpay.com/v1/checkout.js"
//     script.onload = () => setIsScriptLoaded(true)
//     document.body.appendChild(script)
//   }, [])

//   const handlePayment = async () => {
//     if (amountInput === 0) {
//       toast({
//         title: "Invalid amount",
//         description: "Please enter a valid amount",
//         variant: "destructive",
//       })
//       return
//     }
//       setButtonClicked(true)
//     if (!isScriptLoaded) {
//       toast({
//         title: "Payment system loading",
//         description: "Payment system is still loading. Please try again in a moment.",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       const orderCreationResponse = await axios.post('/api/create-order', {
//         "amount": amountInput * 100
//       })

//       const { id, amount, currency } = orderCreationResponse.data

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
//         amount,
//         currency,
//         name: 'BlogVerse',
//         description: 'We highly appreciate your Help!!',
//         order_id: id,
//         handler: async function (response: any) {
//           const data = {
//             "serverId": id,
//             "razorpay_payment_id": response.razorpay_payment_id,
//             "razorpay_signature": response.razorpay_signature
//           }

//           const verificationResponse = await axios.post('/api/verify-order', data)

//           if (verificationResponse.status === 200) {
//             confetti({
//               particleCount: 100,
//               spread: 70,
//               origin: { y: 0.6 }
//             })
//             toast({
//               title: "Payment successful",
//               description: "Thank you for your donation",
//               variant: "default",
//               duration: 3000,
//               className: 'bg-green-500 text-white'
//             })
//             setButtonClicked(false)
//             router.push('/home')
//           } else {
//             toast({
//               title: "Payment unsuccessful",
//               description: "Payment couldn't be verified, please try again",
//               variant: "destructive",
//               duration: 3000,
//             })
//           }
//         },
//         prefill: {
//           name: 'BlogVerse',
//           email: userEmail,
//         },
//         theme: {
//           color: '#3F68DE'
//         },
//         modal: {
//           ondismiss: function(){

//           }
//         }

//       }

//       const rzp = new (window as any).Razorpay(options)
      
//       rzp.open()
//       setpayment(true)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while processing your payment. Please try again.",
//         variant: "destructive",
//       })

//       setButtonClicked(false)
//     }
//   }

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div   
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card className="w-96 bg-transparent bg-opacity-80 backdrop-blur-none rounded-xl shadow-xl">
//             <CardHeader>
//               <CardTitle className="text-3xl font-bold text-white text-center">Donate to BlogVerse</CardTitle>
//               <CardDescription className="text-white text-center">Your support keeps us writing!</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="relative mt-4 flex items-center">
//                 <div className="absolute left-3">
//                   <IndianRupee className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <Input
//                   type="number"
//                   placeholder="Enter amount"
//                   className="pl-10 text-lg w-full text-nowrap text-white"
//                   onChange={(e) => setAmount(parseInt(e.target.value))}
//                 />
//               </div>
//               <  div className="mt-6">
//                  <Button
//                  onClick={handlePayment}
//                  className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-hover-700 hover:to-slate-900 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//                  disabled={!isScriptLoaded}
//                >
//                  {isScriptLoaded && buttonclicked===false ? 'Donate Now' : <Loader2 className="animate-spin scroll-smooth" />}
//                  {buttonclicked ? 'Initalizing payment gateway' :<></>}
//                </Button>
//               </div>


//                 {payment? <>
                       
//                            </>:
//                   <></>}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </>
//   )
// }
  
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Loader2 } from 'lucide-react'
import { useSession } from "next-auth/react"
import {  useToast } from "@/hooks/use-toast"

export default function Donate() {
  const router = useRouter()
  const { toast } = useToast()
  const currentSession = useSession()
  const userEmail = currentSession.data?.user?.email
  const [amountInput, setAmount] = useState<number>(0)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => {
      setIsScriptLoaded(false)
      toast({
        title: "Script loading failed",
        description: "Failed to load the payment system. Please refresh the page and try again.",
        variant: "destructive",
      })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (amountInput === 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsInitializing(true)

    if (!isScriptLoaded) {
      toast({
        title: "Payment system loading",
        description: "Payment system is still loading. Please try again in a moment.",
        variant: "destructive",
      })
      setIsInitializing(false)
      return
    }

    try {
      const orderCreationResponse = await axios.post('/api/create-order', {
        "amount": amountInput * 100
      })

      const { id, amount, currency } = orderCreationResponse.data

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount,
        currency,
        name: 'BlogVerse',
        description: 'We highly appreciate your Help!!',
        order_id: id,
        handler: async function (response: any) {
          const data = {
            "serverId": id,
            "razorpay_payment_id": response.razorpay_payment_id,
            "razorpay_signature": response.razorpay_signature
          }

          const verificationResponse = await axios.post('/api/verify-order', data)

          if (verificationResponse.status === 200) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
            toast({
              title: "Payment successful",
              description: "Thank you for your donation",
              variant: "default",
              duration: 3000,
              className: 'bg-green-500 text-white'
            })
            router.push('/home')
          } else {
            toast({
              title: "Payment unsuccessful",
              description: "Payment couldn't be verified, please try again",
              variant: "destructive",
              duration: 3000,
            })
          }
          setIsInitializing(false)
        },
        prefill: {
          name: 'BlogVerse',
          email: userEmail,
        },
        theme: {
          color: '#3F68DE'
        },
        modal: {
          ondismiss: function() {
            setIsInitializing(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any){
        toast({
          title: "Payment failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        })
        setIsInitializing(false)
      })
      
      rzp.open()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsInitializing(false)
    }
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <motion.div   
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}       
      >   
        <Card className="w-96 bg-transparent bg-opacity-80 backdrop-blur-none rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Donate to BlogVerse</CardTitle>
            <CardDescription className="text-white text-center">Your support keeps us writing!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mt-4 flex items-center">
              <div className="absolute left-3">
                <IndianRupee className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                type="number"
                placeholder="Enter amount"
                className="pl-10 text-lg w-full text-nowrap text-white"
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="mt-6">
              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-hover-700 hover:to-slate-900 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                disabled={!isScriptLoaded || isInitializing}
              >
                {isInitializing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    Initializing payment...   </div>
                ) : isScriptLoaded ? (
                  'Donate Now'
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

