import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all clubs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clubs = await prisma.club.findMany();
    return NextResponse.json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}


// POST: Create a new club
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newClub = await prisma.club.create({
      data: {
        sportCode: body.sportCode,
        sportName: body.sportName,
        clubCode: body.clubCode,
        clubName: body.clubName,
        subCity: body.subCity,
        district: body.district || null,
        phone: body.phone || null,
        registrationYear: body.registrationYear,
        sportNameEn: body.sportNameEn || null,
        clubNameEn: body.clubNameEn || null,
        documentPath: body.documentPath || "[]",
      },
    });
    return NextResponse.json(newClub);
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Failed to create club", details: error },
      { status: 500 }
    );
  }
}

