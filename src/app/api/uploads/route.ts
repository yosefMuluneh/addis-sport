import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import { join } from "path";
import { nanoid } from "nanoid";
import { unlink } from "fs/promises";

const getUploadDir = () => {
  return process.env.UPLOAD_DIR || join(process.cwd(), "public/uploads");
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const filePaths: string[] = [];

    for (const file of files) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/svg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only JPEG, PNG, GIF, JPG, SVG, and WEBP are allowed.` },
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size is 5MB.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `${nanoid()}.${fileExtension}`;
      const filePath = join(uploadDir, uniqueFileName);

      console.log(`Saving to persistent storage: ${filePath}`);
      await writeFile(filePath, buffer);

      const existsInUploadDir = await fs.promises.access(filePath).then(() => true).catch(() => false);
      console.log(`File exists in persistent storage: ${existsInUploadDir}`);

      // Return API route path
      filePaths.push(`/api/uploads/${uniqueFileName}`);
    }

    return NextResponse.json({ filePaths });
  } catch (error) {
    console.error("Error uploading files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to upload files", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filePaths } = await req.json();

    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      return NextResponse.json(
        { error: "No file paths provided" },
        { status: 400 }
      );
    }

    const uploadDir = getUploadDir();
    const deletedFiles = [];

    for (const filePath of filePaths) {
      const fileName = filePath.replace("/api/uploads/", ""); // Extract filename
      const fullPath = join(uploadDir, fileName);
      try {
        await unlink(fullPath);
        deletedFiles.push(filePath);
      } catch (error) {
        console.error(`Failed to delete ${fullPath}:`, error);
      }
    }

    return NextResponse.json({
      message: "Files deleted successfully",
      deletedFiles,
    });
  } catch (error) {
    console.error("Error deleting files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to delete files", details: errorMessage },
      { status: 500 }
    );
  }
}