
import { prisma } from "@/lib/prisma";


import { NextRequest } from "next/server";


export async function DELETE( request:NextRequest,{params}:{params:Promise<{email:string}>}){
        
      try {
            // const session = await auth();
            // console.log('delete api ',session?.user)  // idk why the hell it stays undefined
            // const userId = session?.currentUser?.id

            const email= (await params).email;
            console.log('this is the email at line 17 at delteeUser api',email)
             const deleteResponse = await prisma.user.delete({
                 where:{
                      email:email

                 }
             })

             console.log('this si the deleteuser api response line 25',deleteResponse)
             return Response.json({status:200
             })
      } catch (error) {
          
        console.log('this si the deleteuser api response lne 16',error)
        return Response.json({status:500})
      }
}