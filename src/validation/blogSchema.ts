import { title } from "process"
import {z} from "zod"

export const blogSchema =  z.object({
    title:z.string().min(10,{message:"minimum length should be atleast 10 characters"}),
    content:z.string().min(200,{message:"Blog lenght should be atleast 200 characters"}),
    image: z.instanceof(File).optional(),
     
})