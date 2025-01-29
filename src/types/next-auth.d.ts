import { DefaultSession, User } from "next-auth";
 
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    isVerified?: boolean;
  }

  interface Session {
    currentUser: { 
      isVerified?: boolean;      
    } & DefaultSession["user"];
  }

}

 s