// import { auth } from '@/auth';
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";

// export async function POST(request: Request) {
//   try {
//     const currentSession = await auth();
    
//     console.log(`this is session ${currentSession}`)
//     console.log(currentSession)
//     const { title, content } = await request.json();
//     const authorId = currentSession?.user?.id || "";
//     const response = await prisma.post.create({
//       data: {
//         title,
//         content,
//         authorId,
//         published: true,
//       },
//     });
//     console.log(response);
//     if (!response) {
//       console.log(
//         `there was something wrong at line 26, createblogapi,`,
//         response
//       );
//       return Response.json(
//         {
//           message: "Something went wrong, line 25 at createBlog api",
//         },
//         { status: 500 }
//       );
//     }
//     return Response.json(
//       {
//         message: "Blog created successfully!!",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);
//     return Response.json(
//       {
//         message: "There was an error while creating the blog, in catch block",
//       },
//       { status: 500 }
//     );
//   }
// }



// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });
 

// export async function POST(request: Request) {
//   try {
//     const currentSession = await auth();
 

//     const authorId = currentSession?.user?.id || null;

//     const formData = await request.formData();
//     const title = formData.get("title") as string;
//     const content = formData.get("content") as string;
//     const imageFile = formData.get("image") as File | null;

//     if (!title || !content) {
//       return new Response( 
//         JSON.stringify({ message: "Title and content are required" }),
//         { status: 400 }
//       );
//     }

//     let imageUrl: string | null = null;

//     if (imageFile) {
//       // Generate a unique filename
//       const uniqueFileName = `${authorId}/${Date.now()}-${imageFile.name}`;

//       // Generate a presigned URL
//       const command = new PutObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET_NAME!,
//         Key: uniqueFileName,
//         ContentType: imageFile.type,
//       });

//       // for getting a specific URL, one can use the GetObjectCommand() method, which takes a key  or basiclly the file name as an argument, which you goots to know

//     console.log(`this is the image type ${imageFile.type}`)
        
//       const presignedUrl = await getSignedUrl(s3Client, command, {
//         expiresIn: 3600, // URL valid for 1 hour
//       });

//       // Upload the file directly to S3
//       const uploadResponse = await fetch(presignedUrl, {
//         method: "PUT",
//         body: imageFile,
//         headers: {
//           "Content-Type": imageFile.type || "application/octet-stream",
//         },
//       });

//       if (!uploadResponse.ok) {
//         return new Response(
//           JSON.stringify({ message: "Image upload failed" }),
//           { status: 500 }
//         );
//       }

//       // Save the public S3 URL
//       imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

//       //https://mediumbucket17.s3.eu-north-1.amazonaws.com/029b7fd5-6e76-4cd5-a8e2-11320645e0e6/1735315330364-9e644574-07e3-49f7-a31e-8a610e212aff.jpg
//     }
//      const authorIds= authorId as string 
//     // Save the blog details in the database
//     const response   = await prisma.post.create({
//       data: {
//         title,
//         content,
//         authorId: authorIds,
//         postUrl:imageUrl ,
//         published: true,
//       },
//     });

//     if (!response) {
//       return new Response(
//         JSON.stringify({
//           message: "Failed to create the blog post",
//         }),
//         { status: 500 }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         message: "Blog created successfully!",
//         post: response,
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({
//         message: "An error occurred while creating the blog post",
       
//       }),
//       { status: 500 }
//     );
//   }
// }





import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

// Define types for better type safety
// type BlogPost = {
//   title: string;
//   content: string;
//   imageUrl?: string;
//   authorId: string;
// };

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (imageFile) {
      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { message: "Invalid file type. Only JPEG, PNG, and SVG files are allowed." },
          { status: 400 }
        );
      }

      // Validate file size
      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      // Generate unique filename using UUID pattern
      const uniqueFileName = `${session.user.id}/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

      // Create PutObject command for S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        ContentType: imageFile.type,
        CacheControl: 'public, max-age=31536000', // Cache for 1 year
      });

      // Generate presigned URL
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // URL valid for 1 hour
      });

      // Upload to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      });  
      console.log('this is the uploadd response', uploadResponse)
//       const etag = uploadResponse.headers.get("ETag");
// // console.log("ETag:", etag);
// Cache-Control	Controls how long a file should be cached without checking for updates.
// // ETag	Helps browsers check if the file has changed before downloading again.
// You're right! If you're already using Server-Sent Events (SSE) and React Query for updating the data dynamically, then caching mechanisms like ETag and Cache-Control become less critical for your real-time updates, 
// especially for your use case where the content (like blog images or posts) can change frequently and should be updated immediately on the client side.




               // Server-side (Not affected by CORS)
// const uploadUrl = await getSignedUrl(s3Client, new PutObjectCommand({
//   Bucket: 'your-bucket',
//   Key: 'image.jpg'
// }));

// // Browser-side (Would normally be affected by CORS, but presigned URL bypasses it)
// await fetch(uploadUrl, {
//   method: 'PUT',
//   body: file
// });

// // Browser-side (Affected by CORS - this is where you had issues)
// <img src="https://your-bucket.s3.amazonaws.com/image.jpg" />
 


// ExposeHeaders controls which response headers JavaScript in the browser can access.
// It applies only to headers in the response from S3 (not request headers from the frontend).
// If a header is not listed in ExposeHeaders, JavaScript cannot access it, even if S3 sends it. ---> cors


      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
      }

      // Construct the public URL for the uploaded image
      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    }

    // Create blog post in database
    const blogPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        postUrl: imageUrl,
        published: true,
      },
    });

    return NextResponse.json({
      message: "Blog post created successfully",
      post: blogPost
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({
      message: "Failed to create blog post",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}