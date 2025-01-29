"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen fixed inset-0 overflow-auto h-full w-full bg-gray-900 text-gray-100">
      <header className="container mx-auto py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">BlogVerse</h1>
          <div className="space-x-4">
            {/* <Button variant="outline">
              <Link
                href={"/sign-in"}
                className= "text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Sign In
              </Link>
            </Button> */}
            <Button
              variant="outline"
              className=" bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2  hover:bg-slate-400 hover:text-white hover:cursor-pointer   hover:transition-transform  duration-300 ease-in-out hover:scale-105 "
            >
             <Link href={'/sign-up'}>
             
              Get Started,
              Sign up!
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
       
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
              Welcome to BlogVerse!
            </div>
            <div className="font-extralight text-base text-black md:text-4xl dark:text-neutral-200 py-4">
              Explore the world of blogs and share your own stories.
            </div>
            <Link href={"/sign-in"}>
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2  hover:bg-slate-400 hover:text-white hover:cursor-pointer hover:scale-150  hover:transition-transform .2s ease-in-out 0s ">
            Explore! 
            </button>
            </Link>
          
          </motion.div>
        </AuroraBackground>
      </main>

      <footer className="bg-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 BlogVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
