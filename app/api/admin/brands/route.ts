import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const brands = await prisma.brand.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { models: true }
                }
            }
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
