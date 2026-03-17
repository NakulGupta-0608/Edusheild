import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const dir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await mkdir(dir, { recursive: true });

    const filepath = path.join(dir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL for the file to the frontend
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
