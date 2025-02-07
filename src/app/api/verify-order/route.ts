import axios from "axios";
import { NextRequest } from "next/server";

export async function POST ( request:NextRequest){
    

    try {

        // const data = {
        //     "serverId": id,
        //     "razorpay_payment_id": response.razorpay_payment_id,
        //     "razorpay_signature": response.razorpay_signature
        //   }

        const {serverId,razorpay_payment_id,razorpay_signature }= await request.json();

        const verificationResponse = await axios.post('http:go-api:8080/api/v1/verify',{
            order_id:serverId,
            razorpay_payment_id:razorpay_payment_id,    
            razorpay_signature:razorpay_signature
        })

        const {data}=  verificationResponse;
         console.log('this is the data from the line 53 verification response',data)
        console.log('This is the verification response of the verify order in TS', verificationResponse)
        return Response.json( verificationResponse.data
           )
        
    } catch (error) {
          console.log('this is the api error of verify-order in TS',error);
          return Response.json({
             message:"There was a problem while verifying the order"
          })
    }
}