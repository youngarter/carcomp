import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
    // Auth guard – admin only
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const slug = formData.get("slug") as string || "draft";

        // Use current date for folder year-mm-dd
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateFolder = `${year}-${month}-${day}`;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only images (JPEG, PNG, WebP, GIF, AVIF) are allowed." }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize names for folder structure
        const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const safeSlug = sanitize(slug);

        const folderPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            "alaune",
            safeSlug,
            dateFolder
        );

        // Create directory recursively
        await mkdir(folderPath, { recursive: true });

        const ext = path.extname(file.name);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}${ext}`;
        const filePath = path.join(folderPath, filename);

        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/alaune/${safeSlug}/${dateFolder}/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
