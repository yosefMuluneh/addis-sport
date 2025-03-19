import { NextRequest, NextResponse } from "next/server";

// In-memory store; replace with database in production
let clubs = [
  { sportCode: "1/1", sportName: "Football", clubCode: "AA001", clubName: "Addis United", subCity: "Bole", district: "03", phone: "0912345678" },
  { sportCode: "1/1", sportName: "Basketball", clubCode: "AA002", clubName: "Ethio Hoopers", subCity: "Kirkos", district: "05", phone: "0987654321" },
  // ... other initial data
];

export async function GET() {
  return NextResponse.json(clubs);
}

export async function POST(req: NextRequest) {
  const newClub = await req.json();
  clubs.push(newClub);
  return NextResponse.json(newClub, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const updatedClub = await req.json();
  clubs = clubs.map((club) =>
    club.clubCode === updatedClub.clubCode ? updatedClub : club
  );
  return NextResponse.json(updatedClub);
}

export async function DELETE(req: NextRequest) {
  const { clubCode } = await req.json();
  clubs = clubs.filter((club) => club.clubCode !== clubCode);
  return NextResponse.json({ message: "Club deleted" });
}