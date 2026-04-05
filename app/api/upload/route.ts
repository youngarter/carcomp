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
        const brand = formData.get("brand") as string || "unknown";
        const year = formData.get("year") as string || "unknown";
        const finition = formData.get("finition") as string || "unknown";

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
        const brandSlug = sanitize(brand);
        const modelSlug = sanitize(formData.get("model") as string || "unknown");
        const yearSlug = sanitize(year);
        // We assume "new" as default phase type if not provided, for the generation folder
        const phaseType = formData.get("phaseType") as string || "new";
        const generationSlug = `${sanitize(phaseType)}-${yearSlug}`;
        const finitionSlug = sanitize(formData.get("slug") as string || finition);
        const index = formData.get("index") as string || "0";

        const folderPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            "cars",
            brandSlug,
            modelSlug,
            generationSlug,
            finitionSlug
        );

        // Create directory recursively
        await mkdir(folderPath, { recursive: true });

        // Save file with specific naming: {slug}-{index}.{ext} // or cover.jpg for principal
        const ext = path.extname(file.name);
        const filename = index === "0" ? `cover${ext}` : `${finitionSlug}-${index}${ext}`;
        const filePath = path.join(folderPath, filename);
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/cars/${brandSlug}/${modelSlug}/${generationSlug}/${finitionSlug}/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
