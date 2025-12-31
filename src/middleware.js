import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("muntaha-shop")?.value;

  // if (token && (pathName.startsWith("/login") || pathName.startsWith("/reset-pass"))) {
  //   return NextResponse.redirect(new URL("/components/dashboard", request.url));
  // }

  // if (pathName.startsWith("/components/dashboard")) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }

  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  //     const { payload } = await jwtVerify(token, secret);
  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/login", "/reset-pass", "/components/dashboard", "/components/dashboard/:path*"],
};
