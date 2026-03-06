import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const session = await auth();
    const { nextUrl } = req;

    // Pattern: /car/[slug]/edit
    const isEditRoute = nextUrl.pathname.match(/\/car\/[^/]+\/edit/);

    if (isEditRoute) {
        if (!session) {
            return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
        }

        const userPermissions = (session.user as any)?.permissions || [];
        const userRole = (session.user as any)?.role;

        if (!userPermissions.includes("EDIT_CAR") && userRole !== "SUPER_ADMIN") {
            return NextResponse.rewrite(new URL("/api/auth/error?error=AccessDenied", nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/car/:slug/edit"],
};
