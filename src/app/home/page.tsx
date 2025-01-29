 
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import NavBar from "@/components/shared/NavBar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { WavyBackground } from "@/components/ui/wavy-background";
 type blogtype={
    id: string;
    title: string;
    content: string;
    published: boolean;
    authorId: string;
    postUrl: string;
    createdAt: string;
    updatedAt: string;
    author: {name:string, email:string}
 }
const fetchBlogs = async () => {
  const { data } = await axios.get("/api/getAll");

  return data.response
    .map((blog: blogtype) => ({
      ...blog,
      postUrl: blog.postUrl?.startsWith("blob:") ? null : blog.postUrl, // Remove Blob URLs
    }))
    .sort(
      (a: blogtype, b: blogtype) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export default function DashBoard() {
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  console.log("These are the blogs fetched from db:");
  console.log(blogs);

  return (
    <div className="relative min-h-screen">
      <WavyBackground className="fixed inset-0" />
      <NavBar />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              className="text-4xl font-bold text-white animate-updown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Latest Blogs
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button className="animate-updown bg-gradient-to-r from-slate-500 to-slate-700 hover:from-blue-500 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-full transform transition duration-300 ease-in-out hover:scale-105">
                <Link href="/paymentPage">Donate Now!</Link>
              </Button>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          ) : error ? (
            <motion.p
              className="text-red-500 text-center text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Something went wrong: {(error as Error).message}
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {blogs?.map((blog: blogtype) => (
                <motion.div
                  key={blog.id}
                  className="group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/blog/${blog.id}`}>
                    <div
                      className={cn(
                        "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 bg-cover bg-center",
                        !blog.postUrl && "bg-gradient-to-br from-gray-800 to-blue-900"
                      )}
                      style={
                        blog.postUrl
                          ? {
                              backgroundImage: `url(${blog.postUrl})`,
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                            }
                          : undefined
                      }
                    >
                      <div className="absolute inset-0 bg-black opacity-50 transition duration-300 group-hover:opacity-30"></div>
                      <div className="flex flex-row items-center space-x-4 z-10">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-300">
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-bold text-white underline">by {blog.author.name}</p>
                        </div>
                      </div>
                      <div className="text content mt-4">
                        <h2 className="font-bold text-2xl text-white relative z-10 mb-3 group-hover:underline">
                          {blog.title}
                        </h2>
                        <p className="font-normal text-sm text-gray-200 relative z-10 line-clamp-3">
                          {blog.content}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
