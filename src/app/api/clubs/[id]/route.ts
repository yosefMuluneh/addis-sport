import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// GET: Fetch club by id
export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //get id from params
  const { id } = await params;

  console.log("get id of the club", id)

  try {
    const club = await prisma.club.findUnique({
      where: { id: id as string },
    });
    return NextResponse.json(club);
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Failed to fetch club" },
      { status: 500 }
    );
  }
}

// PUT: Update club by id
export async function PUT(
    req: NextRequest,
    { params } : { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    //get id from params
    const { id } = await params;
    console.log("id", id);
    try {
        const body = await req.json();
        console.log("body--file delete/upload....", body);
        const updatedClub = await prisma.club.update({
        where: { id: id as string },
        data: { ...body },
        });
        return NextResponse.json(updatedClub);
    } catch (error) {
        console.error("Error updating club:", error);
        return NextResponse.json(
        { error: "Failed to update club" },
        { status: 500 }
        );
    }
    }

// DELETE: Delete club by id
export async function DELETE(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    //get id from params
    const { id } = await params;
  try {
    await prisma.club.delete({ where: { id: id as string } });
    return NextResponse.json({ message: "Club deleted" });
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 }
    );
  }
}