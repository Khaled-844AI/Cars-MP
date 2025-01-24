import {clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from 'next/server';


const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/garage(.*)',
  '/car(.*)',
  '/admin(.*)',
  '/api(.*)',
  '/add-car(.*)',
  '/conversations(.*)',
  '/role(.*)']);

export default clerkMiddleware(async(auth, req) => {
  const {userId} = await auth();

  if(userId){
    const user = clerkClient.users.getUser(userId);
    const role = (await user).publicMetadata?.isBuyer || (await user).publicMetadata?.isDealer;
    if(role && req.nextUrl.pathname === '/role'){
      return NextResponse.redirect(new URL('/', req.url));
    }

    if(role && !(await user).publicMetadata?.isAdmin && req.nextUrl.pathname === '/admin'){
      return NextResponse.redirect(new URL('/', req.url));
    }

  }  

  if (isProtectedRoute(req)) {
    await auth.protect(); 
  }
  
});

export const config = {
  matcher: [
    // Match all dynamic routes, excluding static files and internal Next.js files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always enforce middleware for API routes and tRPC
    '/(api|trpc)(.*)',
  ],
};
