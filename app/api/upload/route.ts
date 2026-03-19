import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Save locally to /public/uploads/ folder
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Create uploads folder if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a unique filename using timestamp
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadsDir, uniqueName);

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    // ✅ Return local URL - this is saved to MongoDB
    const localUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}