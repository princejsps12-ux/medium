import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
    const url = req.nextUrl;

    // If authenticated and on a public route, redirect to /home
    if (req.auth && ['/sign-in', '/sign-up', '/'].includes(url.pathname)) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // If not authenticated and on a protected route, redirect to /sign-in
    if (!req.auth && url.pathname === '/home') {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    

    return NextResponse.next();
});

 
export const config = {
    matcher: ['/', '/sign-in', '/sign-up', '/home','/api/checkAuthor/:path*','/api/createBlog'],
};
