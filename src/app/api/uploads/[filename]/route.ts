import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  console.log("GET /api/uploads/:filename");
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params


  const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), "public/uploads");
  const filePath = join(uploadDir, filename);

 

  try {
    const file = await readFile(filePath);
    console.log(`File read successfully: ${filePath}, size: ${file.length} bytes`);
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      webp: "image/webp",
    }[extension] || "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}