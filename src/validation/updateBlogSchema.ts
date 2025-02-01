
import { z } from "zod"
 

export const updateBlogSchema = z.object({
      blogId:z.string(),
      title:z.string(),
      content:z.string()
})