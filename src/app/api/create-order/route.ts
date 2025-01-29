import axios from "axios";
import { NextRequest } from "next/server";

 export async function POST( request:NextRequest){
       
    try{
            const { amount} = await request.json();
             
            const orderCreationResponse = await axios.post('http:localhost:8080/api/v1/orders',{
                  amount:amount
            })
            
            console.log('this is the order creation response at the ts api',orderCreationResponse.data)
            return Response.json(orderCreationResponse.data)
             
    }
    catch(error){
         console.log('this is the api error for creating order',error)
         return Response.json({
            message:"There was an error while creating the order!"
         })
    }
}