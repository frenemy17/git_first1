import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { ownerPhone: phone },
    });

    if (business) {
      return NextResponse.json({ exists: true, businessId: business.id });
    }

    return NextResponse.json({ exists: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
