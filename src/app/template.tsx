// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { usePathname } from "next/navigation"

// export default function Template({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={pathname}
//         initial={{ 
//           opacity: 0,
//           y: 20,
//           scale: 0.98
//         }}
//         animate={{ 
//           opacity: 1,
//           y: 0,
//           scale: 1
//         }}
//         exit={{ 
//           opacity: 0,
//           y: -20,
//           scale: 0.98 
//         }}
//         transition={{
//           duration: 0.3,
//           ease: "easeInOut",
//           staggerChildren: 0.1
//         }}
//         className="min-h-screen"
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   )
// }
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-16 h-16 relative"
            >
              <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-r-blue-300 animate-pulse"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
}
