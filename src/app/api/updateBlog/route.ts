import {auth} from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'


export async function PUT(req: NextRequest){
    try {
        const currentSession = await auth()
        console.log(`this is the currentsesion`,currentSession)

         const {postUpdateId, newTitle, newContent ,newpostUrl}= await req.json(); // new content 
             
         //checking if the post even exists or not
         const postCheck = await prisma.post.findUnique({
            where:{
                id:postUpdateId || ' ',
                authorId:currentSession?.user?.id || ' '
                 
            }
         })
         console.log(`checkingPost response`,postCheck)
         if( !postCheck){
            return Response.json({
                message:"No post found to update"
            },{status:404})
         }

         const response = await prisma.post.update({
            where:{
                id:postUpdateId || ' ',
                authorId:currentSession?.user?.id || ' '
            },
            data:{
                title:newTitle,
                content:newContent,
                postUrl:newpostUrl
            }
         })

         if( !response){
            console.log(`This is the error at line 24, update blog api`,response)
            return Response.json({
                message:"There was an error in updating the post"
            },{status:500})
         }


         console.log(`this is line 31, at updateBlog api`,response)
         return Response.json({
             message:"Post updated successfully!"
         },{status:200})
    } catch (error) {
        console.log(`catch block at update blog api`,error)
        return Response.json(
            {
              message: "There was an error while updating the blog, in catch block",
            },
            { status: 500 }
          );
    }
}