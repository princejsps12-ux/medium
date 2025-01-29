import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  
  const isSSE = req.headers.get("accept") === "text/event-streamm";
  if (isSSE) {
    const stream = new ReadableStream({
      async start(controller) {
        const session = await auth();
        if (!session || !session?.user) {
          controller.enqueue(
            `data:${JSON.stringify({
              message: "unauthorized,Please login",
            })}\n\n`
          );
          controller.close();
          return;
        }

        const sendUpdated = async () => {
          try {
            const blogs = await prisma.post.findMany({
              where: {
                published: true,
              },
              include: {
                author: {
                  select: {
                    name: true,
                    email: true,
                    id: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            });

            controller.enqueue(`data:${JSON.stringify(blogs)}\n\n`);
          } catch (error) {
            console.log("Error fetching all blogs for home page", error);
            controller.enqueue(
              `data:${JSON.stringify({
                message: "Error fetching all blogs for home page",
              })}\n\n`
            );
          } //catch blocks end here
          await sendUpdated();
          const interval = setInterval(sendUpdated, 2000);

          req.signal.addEventListener("abort", () => {
            clearInterval(interval);
            controller.close();
          });
        };
      }, // controller ends here
    }); //stream ends here

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } // sse block ends here

  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        {
          message: "Unauthorized - Please login",
        },
        { status: 401 }
      );
    }
    const response = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    console.log(`this is get allapi response`, response);

    return Response.json(
      {
        response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(`this is the error at getallBlog api`, error);
    return Response.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
