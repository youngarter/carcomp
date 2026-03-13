import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const isLoggedIn = !!session?.user;
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

    // Protect all /admin/* routes
    if (nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn || !isAdmin) {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    // Protect all /api/admin/* routes
    if (nextUrl.pathname.startsWith("/api/admin")) {
        if (!isLoggedIn || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};
