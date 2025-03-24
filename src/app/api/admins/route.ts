import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();


export async function PUT(req: NextRequest) {
  // Get the session to verify the user
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, username, password } = await req.json();

    // Ensure the user can only update their own data
    if (id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prepare update data
    const updateData: { username: string; password?: string } = { username };

    // Hash the password if provided
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update the admin in the database
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedAdmin.id,
      username: updatedAdmin.username,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}