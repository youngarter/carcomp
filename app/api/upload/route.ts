import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const brand = formData.get("brand") as string || "unknown";
        const year = formData.get("year") as string || "unknown";
        const finition = formData.get("finition") as string || "unknown";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize names for folder structure
        const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const folderPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            sanitize(brand),
            sanitize(year),
            sanitize(finition)
        );

        // Create directory recursively
        await mkdir(folderPath, { recursive: true });

        // Save file
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(folderPath, filename);
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${sanitize(brand)}/${sanitize(year)}/${sanitize(finition)}/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
