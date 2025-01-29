"use client";

import { useSession } from "next-auth/react";
import React from "react";
import axios from "axios";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Button } from "@/components/ui/button";
import { Loader2, HomeIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";
import { useQuery } from "@tanstack/react-query";

interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

export default   function UserBlog() {
  const { data: session } = useSession();
  const authorId = session?.user?.id ||' ';

  const { data: myblogs, isPending, isError, error } = useQuery({
    queryKey: ["myBlogs", authorId],
    queryFn: async () => {
      const response = await axios.get(`/api/myBlogs?authorId=${authorId}`);
      return response.data.response;
    },
    staleTime: 1000 * 60, // 1 min
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 2, // 2 min
    enabled: !!authorId, // Only run when authorId is available
  });

  return (
    // <div className="min-h-screen h-full w-full">
    //   <Vortex className="min-h-screen">
    //     <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    //       <div className="flex justify-between items-center mb-8">
    //         <h1 className="text-3xl font-bold text-white dark:text-black">
    //           Your Blogs!
    //         </h1>
    //         <Link href={"/createBlogPage"}>
    //           <Button className="flex items-center space-x-2">
    //             <PlusCircle className="h-5 w-5" />
    //             <span>New Blog</span>
    //           </Button>
    //         </Link>
    //       </div>

    //       {/* Handle Loading State */}
    //       {isPending && (
    //         <div className="text-center py-12 flex items-center justify-center">
    //           <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
    //             Loading Blogs...
    //             <Loader2 className="animate-spin scroll-smooth mx-16"/>
    //           </h2>
    //         </div>
    //       )}

    //       {/* Handle Error State */}
    //       {isError && (
    //         <div className="text-center py-12">
    //           <h2 className="text-2xl font-semibold text-gray-400 dark:text-black">
    //             Error Loading Blogs
    //           </h2>
    //           <p className="mt-2 text-red-500">
    //             {error instanceof Error ? error.message : "Unknown Error"}
    //           </p>
    //         </div>
    //       )}

    //       {/* Handle Empty State */}
    //       {!isPending && !isError && (myblogs == null || myblogs.length === 0) && (
    //         <div className="text-center py-12">
    //           <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
    //             No blogs yet
    //           </h2>
    //           <p className="mt-2 text-gray-500 dark:text-gray-400">
    //             Start writing your first blog post!
    //           </p>
    //         </div>
    //       )}

    //       {/* Render Blogs */}
    //       {!isPending && !isError && myblogs.length > 0 && (
    //         <HoverEffect
    //           items={myblogs.map((blog:Blog) => ({
    //             title: blog.title,
    //             description:
    //               blog.content.length > 50
    //                 ? blog.content.substring(0, 50) + "..."
    //                 : blog.content,
    //             link: `/blog/${blog.id}`,
    //           }))}
    //           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    //         />
    //       )}
    //     </div>
    //   </Vortex>
    // </div>

    <div className="fixed inset-0 w-full h-full bg-black">
       <Vortex className="absolute inset-0 w-full h-full bg-transparent">
          
      
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Your Blogs!
            </h1>
              <div className=" hover:transition-transform  duration-300 ease-in-out hover:scale-105 hover:border-spacing-2 ">
              <Link href="/createBlogPage">
              <Button className="flex items-center space-x-2">
                <PlusCircle className="h-5 w-5 hover:scale-150 border-spacing-1 border-y-white" />
                <span>New Blog</span>
              </Button>
            </Link>
              </div>
           
             <div  className=" hover:transition-transform  duration-300 ease-in-out hover:scale-105 hover:border-spacing-2 ">
             <Link href="/home">
              <Button className="flex items-center space-x-2 border-spacing-1 border-y-white ">
                  <HomeIcon  className="h-5 w-5 " ></HomeIcon>
                <span>Home</span>
              </Button>
            </Link>
             </div>
           
          </div>
          
          {/* Handle Loading State */}
          {isPending && (
            <div className="text-center py-12 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-300">
                Loading Blogs...
                
                <Loader2 className="animate-spin h-6 w-6 mx-16  "/>
              </h2>
            </div>
          )}

          {/* Handle Error State */}
          {isError && (
            <div className="text-center py-12">
              <p className="mt-2 text-yellow-500">
                {error instanceof Error ? error.message : "Unknown Error"}
              </p>
            </div>
          )}

          {/* Handle Empty State */}
          {!isPending && !isError && (myblogs == null || myblogs.length === 0) && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-300">
                No blogs yet
              </h2>
              <p className="mt-2 text-gray-400">
                Start writing your first blog post!
              </p>
            </div>
          )}

          {/* Render Blogs */}
          {!isPending && !isError && myblogs && myblogs.length > 0 && (
            <HoverEffect
              items={myblogs.map((blog: Blog) => ({
                title: blog.title,
                description:
                  blog.content.length > 50
                    ? blog.content.substring(0, 50) + "..."
                    : blog.content,
                link: `/blog/${blog.id}`,
              }))}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          )}
        </div>
        </Vortex> 
    </div>
  );
}
