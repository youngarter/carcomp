import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Saves a file to the public/uploads directory
 * @param file The file to save
 * @param folder The subfolder inside public/uploads (e.g., 'brands')
 * @returns The public URL of the saved file
 */
export async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to avoid collisions
    const ext = path.extname(file.name) || ".png";
    const filename = `${uuidv4()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/${folder}/${filename}`;
}
