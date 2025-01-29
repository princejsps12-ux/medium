"use client"

import { Button } from "../ui/button"
import { FilePenLine } from 'lucide-react';
import Link from "next/link";
export default function EditBlogButton({params}:{params:{id:string}}){
     const blogId = params.id || ""
          return (
          <>
                <Button className="bg-blue-950 text-white hover:bg-black">
                    <Link href={`/updateBlog/${blogId}`}>
                    <FilePenLine/>
                    </Link>
                </Button>
          </>)
}