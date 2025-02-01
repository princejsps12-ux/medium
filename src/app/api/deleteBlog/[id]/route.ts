
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";



export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
      const id = (await params).id  // this shows a warning without await, idky why, but await helps,,
            // the recieved id  is the blog id
       try {
        
        const deleteResponse = await  prisma.post.delete({
            where:{
                id:id  // thhis si the blogId.
            }
        })
         console.log(`this is the deleteapi response`,deleteResponse);
         
         return Response.json({
            message:"Blog deleted successfully",
            deleteResponse,
         },{status:200})
       } catch (error) {
          console.log(error)
          return Response.json({
            message:"Internal sever error",
          },{status:500})
       }
   
}