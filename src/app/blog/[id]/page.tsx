// "use client";

// import axios from "axios";
// import { useParams } from "next/navigation";
// import React from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import DeleteBlog from "@/components/shared/deleteBlog";
// import EditBlogButton from "@/components/shared/editBlog.button";
// import { useQuery } from "@tanstack/react-query";
// import Error from "@/app/error/page";

// // interface Blog {
// //   id: string;
// //   title: string;
// //   content: string;
// //   published: boolean;
// //   authorId: string;
// // }

// export default function BlogPage() {
//   const params = useParams();
//   const blogId = params.id as string;

    
//     const { data : authResponse }  =useQuery({
//          queryKey:["checkAuthor", blogId],
//          queryFn:async ()=>{
//          const response=  await axios.post(`/api/checkAuthor/${blogId}`);
//         return response.data.status
//         }
//       })

//       console.log(" at line 33")
//       console.log(authResponse)

//   const { data: thisBlogResponse, isPending } = useQuery({
//     queryKey: ["thisBlog", blogId],
//     queryFn: async () => {
//       const response = await axios.get(`/api/getBlogById/${blogId}`);
//       console.log(response.data.blogResponse);
//       return response.data.blogResponse;
//     },
//   });

//   if (isPending) return <BlogSkeleton />;
//   if (!thisBlogResponse)
//     return (
//       // <p className="min-h-screen flex items-center justify-center bg-blue-950 text-white">
        
         
//       // </p>
//       <Error error={{ message: "Blog not found", name: "NotFoundError" }} reset={  () =>   axios.get(`/api/getBlogById/${blogId}`)} />
//     );
    
//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
//       <div className="min-h-svh max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-blue-300">
//           {thisBlogResponse.title}
//         </h1>
//         <div className="bg-gray-800 rounded-lg overflow-hidden">
//           <div className="bg-gray-700 px-6 py-3 flex justify-between items-center">
//             <span className="text-sm text-gray-300">Content</span>
//             {authResponse ===200? (
//                 <div className="flex gap-2 bg-gray-400 p-2 rounded-md">
//                 <EditBlogButton params={{ id: thisBlogResponse.id }} />
//                 <DeleteBlog params={{ id: thisBlogResponse.id }} />
//               </div>
//             ) : (
//               <>
//               </>
//             )}
            
//           </div>
//           <ScrollArea className="h-[calc(100vh-10rem)] scroll-smooth">
//              { thisBlogResponse.postUrl && <img src={thisBlogResponse.postUrl} alt="blog" className="w-full h-96 object-cover" />}  
//             <pre className="p-6 text-base leading-relaxed whitespace-pre-wrap break-words">
//               {thisBlogResponse.content}
//             </pre>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   );
// }

// function BlogSkeleton() {
//   return (
//     <div className="min-h-dvh">
//       <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
//         <div className="max-w-6xl mx-auto">
//           <Skeleton className="h-10 w-4/5 bg-gray-700 mb-6" />
//           <div className="bg-gray-800 rounded-lg overflow-hidden">
//             <div className="bg-gray-700 px-6 py-3 flex justify-between items-center">
//               <Skeleton className="h-5 w-28 bg-gray-600" />
//               <Skeleton className="h-5 w-36 bg-gray-600" />
//             </div>
//             <div className="p-6">
//               <Skeleton className="h-5 w-full bg-gray-700 mb-3" />
//               <Skeleton className="h-5 w-full bg-gray-700 mb-3" />
//               <Skeleton className="h-5 w-4/5 bg-gray-700" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteBlog from "@/components/shared/deleteBlog";
import EditBlogButton from "@/components/shared/editBlog.button";
import { useQuery } from "@tanstack/react-query";
 
import ErrorPage from "@/app/error/page";

// BlogPage Component
export default function BlogPage() {
  const params = useParams();
  const blogId = params.id as string;

  // Check author of the blog
  const { data: authResponse } = useQuery({
    queryKey: ["checkAuthor", blogId],
    queryFn: async () => {
      const response = await axios.post(`/api/checkAuthor/${blogId}`);
      return response.data.status;
    },
  });

  // Fetch the blog details
  const {
    data: thisBlogResponse,
    isPending,
    error,
    // This is the inbuilt refetch function from react query to retry fetching the blog, i previusly used refetch here, but wasnt used, so i removed it, see the use later
  } = useQuery({
    queryKey: ["thisBlog", blogId],
    queryFn: async () => {
      const response = await axios.get(`/api/getBlogById/${blogId}`);
      return response.data.blogResponse;
    },
    
    
  });

  const refetch2= async ()=>{
     await axios.get(`/api/getBlogById/${blogId}`);
  }

  // If the data is still loading, show skeleton
  if (isPending) return <BlogSkeleton />;

  // If there's an error (404), show the Error component
  if (error?.message ==="Blog not found") {
     console.log(" at line 33 this is the erorr at blog[id] ",error)
    return <ErrorPage error={{ message: "Blog not found", name: "NotFoundError" }} reset={refetch2} />;
  }

  // If blog is not found or error is not a 404, show an error message,, this is important i guess, solvse some json issue
  if (!thisBlogResponse) {
    return <ErrorPage error={{ message: "Blog not found", name: "NotFoundError" }} reset={refetch2} />;
  }

  // Render the blog content if found
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="min-h-svh max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-300">
          {thisBlogResponse.title}
        </h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-6 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-300">Content</span>
            {authResponse === 200 && (
              <div className="flex gap-2 bg-gray-400 p-2 rounded-md">
                <EditBlogButton params={{ id: thisBlogResponse.id }} />
                <DeleteBlog params={{ id: thisBlogResponse.id }} />
              </div>
            )}
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)] scroll-smooth">
            {thisBlogResponse.postUrl && (
              <img src={thisBlogResponse.postUrl} alt="blog" className="w-full h-96 object-cover" />
            )}
            <pre className="p-6 text-base leading-relaxed whitespace-pre-wrap break-words">
              {thisBlogResponse.content}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component
function BlogSkeleton() {
  return (
    <div className="min-h-dvh">
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-4/5 bg-gray-700 mb-6" />
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-6 py-3 flex justify-between items-center">
              <Skeleton className="h-5 w-28 bg-gray-600" />
              <Skeleton className="h-5 w-36 bg-gray-600" />
            </div>
            <div className="p-6">
              <Skeleton className="h-5 w-full bg-gray-700 mb-3" />
              <Skeleton className="h-5 w-full bg-gray-700 mb-3" />
              <Skeleton className="h-5 w-4/5 bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
