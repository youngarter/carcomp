import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const files: { url: string; name: string; size: number; mtime: Date }[] = [];

        async function walk(dir: string, base: string = "") {
            const list = await fs.readdir(dir, { withFileTypes: true });

            for (const item of list) {
                const res = path.resolve(dir, item.name);
                const relativePath = path.join(base, item.name);

                if (item.isDirectory()) {
                    await walk(res, relativePath);
                } else {
                    const stats = await fs.stat(res);
                    // Filter for image-like files if needed, or just return everything in uploads
                    const ext = path.extname(item.name).toLowerCase();
                    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
                        files.push({
                            url: `/uploads/${relativePath.split(path.sep).join("/")}`,
                            name: item.name,
                            size: stats.size,
                            mtime: stats.mtime
                        });
                    }
                }
            }
        }

        // Check if directory exists
        try {
            await fs.access(UPLOADS_DIR);
            await walk(UPLOADS_DIR);
        } catch (e) {
            // If public/uploads doesn't exist yet, return empty list
            return NextResponse.json([]);
        }

        // Sort by most recent
        files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

        return NextResponse.json(files);
    } catch (error: any) {
        console.error("Media Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url } = await req.json();
        if (!url || !url.startsWith("/uploads/")) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const relativePath = url.replace("/uploads/", "");
        const filePath = path.join(UPLOADS_DIR, relativePath);
        const filename = path.basename(relativePath); // Extract filename for logging

        // Security check: ensure file is inside UPLOADS_DIR
        if (!filePath.startsWith(UPLOADS_DIR)) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        await fs.unlink(filePath);

        // Log activity
        if (session?.user?.id) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: "DELETE_MEDIA",
                    details: `Deleted file: ${filename}`
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Media Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
