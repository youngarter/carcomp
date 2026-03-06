import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    console.log("Admin API GET started");
    const session = await auth();
    console.log("Admin API Session:", session?.user?.id, session?.user?.role);

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        console.warn("Admin API Unauthorized access attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const cars = await prisma.finition.findMany({
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(cars);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
    }
}
