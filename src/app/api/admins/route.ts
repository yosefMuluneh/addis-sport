import { NextRequest, NextResponse } from "next/server";
import { addAdmin } from "@/lib/admins";

export async function POST(req: NextRequest) {
  const newAdmin = await req.json();
  console.log("Received new admin data:", newAdmin);
  const createdAdmin = addAdmin(newAdmin);
  return NextResponse.json(createdAdmin, { status: 201 });
}