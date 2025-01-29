import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { otp, email } = await req.json();
    console.log("this is the email at verify account api:", email);
    console.log("this is the otp at verify account api:", otp);

    // Decode and normalize email for database queries
    const decodedEmail = decodeURIComponent(email).trim().toLowerCase();

    // Find the user with matching email and not verified yet
    const checkUser = await prisma.user.findFirst({
      where: {
        email: decodedEmail,
        isVerified: false,
      },
    });

    console.log("this is the checkUser response:", checkUser);

    if (!checkUser) {
      console.log("this is line 17 at verify user api", checkUser);
      return Response.json(
        { message: "No such user found to be verified!" },
        { status: 404 }
      );
    }

    const userOTPdb = checkUser.otp;

    // If OTP does not match, return an error response
    if (otp !== userOTPdb) {
      console.log("Incorrect OTP entered:", otp);
      return Response.json(
        { message: "Invalid OTP! Please try again." },
        { status: 400 }
      );
    }

    try {
      // Update user verification status
      const response = await prisma.user.update({
        where: {
          email: decodedEmail, // Fixed: Using the normalized email
        },
        data: {
          isVerified: true,
        },
      });

      console.log("this is line 41 at verify user api", response);
      return Response.json(
        { message: "User Verified successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating verification status:", error);
      return Response.json(
        { message: "Couldn't verify the account! Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in verify API:", error);
    return Response.json(
      { message: "Something went wrong! Please try again." },
      { status: 500 }
    );
  }
}
