"use client";
import React from "react";
import CreateBlog from "./createBlog";
import Logout from "./logOut";
import UserBlogs from "./userBlog.button";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const session = useSession();
  return (
    <div>
      <nav
        className="flex justify-between items-center gap-4 p-5 mt-5
  border-b border-gray-600/50 
  bg-gradient-to-r from-gray-900/50 to-gray-800/50
  backdrop-blur-sm
  transition-all duration-500 ease-in-out
  hover:shadow-2xl hover:shadow-blue-500/50 
  rounded-xl sticky top-0 z-50
  mx-4  
        "
      >
        <UserBlogs />
        <CreateBlog />
        <div className="gap-2 flex items-center text-white ">
          <p className="font-bold ">Welcome {session.data?.user?.name}!</p>
          <div>{session.data?.user && <Logout />}</div>
        </div>
      </nav>
    </div>
  );
}
