import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params:Promise<{ id: string }> }// { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    console.log("line 13");
    console.log(session);

    const id= (await params).id
    const blogId = id; // Get ID from route params

    //const session = await GET();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please login",
          session: session,
        },
        { status: 401 }
      );
    }

    const sessionId = session.user.id;
    console.log(`sessionId ${sessionId}  , blogId ${blogId}`);

    const blogCreator = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blogCreator) {
      return NextResponse.json(
        {
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    if (blogCreator.authorId !== sessionId) {
      return NextResponse.json(
        {
          message: "You are not authorized to access this blog",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(`CheckAuthor error:`, error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
