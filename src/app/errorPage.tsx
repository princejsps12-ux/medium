
// 'use client'
 
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { AlertCircle, Home } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'
// import { useEffect } from 'react'
// export default function ErrorPage(  {error, reset}: {error: Error & { digest?: string }; reset: () => Promise<void>}) {

//   const router = useRouter();
//   const {toast}= useToast();
//   const handleRetry = async () => {
//     try {
//        const response = await reset();  // Retry fetching the blog
//        console.log('this is the respone at line 17 at error page',response)
//     } catch (err) {
//       // If the error persists (e.g., 404 again), redirect to the homepage
       
//       console.log('Error during retry:', err);
//       toast({title:"Blog has been deleted!",description:"Redirecting  you to homepage!"})
//       setTimeout(() => router.push('/'), 5000); // Redirect to homepage after 5 seconds, this feel better windows one was very abruptive
//       // window.location.href = "/"; // Redirect to homepage
//     }
//   };

//   useEffect(() => {//, use less, was logging the props that were passed to this component, so basically useless
//     console.log('this is use effect one')
//     console.log(error);
//   }, [error]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-700">
//       <div className="text-center space-y-6 p-8 max-w-md">
//         <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
//         <h1 className="text-3xl font-bold tracking-tight text-white">Oops! Something went wrong with the blog you are trying to access!</h1>
//          <p className="text-muted-foreground text-white">
//           {/*  We apologize for the inconvenience. The blog might have been deleted. Please  return to the homepage. */}
//           {error.message}
//         </p>
//         <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
//           <Button onClick={handleRetry} variant="default" className='hover:scale-110 hover:transition-transform'>
//             Try again
//           </Button>
//           <Button asChild variant="outline" className='hover:scale-110 hover:transition-transform'>
//             <Link href="/">
//               <Home className="mr-2 h-4 w-4 text-black" />
//               <p className='text-black'> Home </p>
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/error.tsx (NOT page.tsx)
'use client'
 
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

// Note: Changed the type to match Next.js error page requirements
type errorObject={
   
     message:string,
     name:string

   
}
export default function Errorpage({
  error,
  reset,
}: {
  error:  errorObject
  reset: () => void  // Changed from Promise<void> to void
}) {
  const router = useRouter();
  const {toast} = useToast();

  const handleRetry = async () => {
    try {
      reset();  // Remove await since reset is not Promise anymore
      // Note: response logging removed since reset doesn't return anything
    } catch (err) {
      console.error('Error during retry:', err);
      toast({
        title: "Blog has been deleted!",
        description: "Redirecting you to homepage!"
      });
      setTimeout(() => router.push('/'), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-700">
      <div className="text-center space-y-6 p-8 max-w-md">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Oops! Something went wrong with the blog you are trying to access!
        </h1>
        <p className="text-muted-foreground text-white">
          {error.message}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button onClick={handleRetry} variant="default" className='hover:scale-110 hover:transition-transform'>
            Try again
          </Button>
          <Button asChild variant="outline" className='hover:scale-110 hover:transition-transform'>
            <Link href="/">
              <Home className="mr-2 h-4 w-4 text-black" />
              <p className='text-black'> Home </p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}