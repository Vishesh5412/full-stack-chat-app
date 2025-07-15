//in nextjs the middleware.js/.ts file always run on server side
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return;
  } catch (err) {
    console.log("ended unexpectedly", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
export const config = {
  matcher: ["/user/:path*"],
};
