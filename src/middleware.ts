import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export default function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    // If the user tries to access the sign-in page, redirect them to the dashboard
    if (url.pathname.startsWith("/auth/signin")) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Allow access to all routes (bypass authentication)
    return NextResponse.next();
}

// Middleware configuration
export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};