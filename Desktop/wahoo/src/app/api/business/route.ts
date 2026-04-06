// src/app/api/business/route.ts
// CRUD for business + config

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { buildSystemPrompt } from "@/lib/ai/groq";
import { z } from "zod";

const CreateBusinessSchema = z.object({
  name: z.string().min(1),
  ownerName: z.string().min(1),
  ownerPhone: z.string().min(10),
  agentName: z.string().default("Assistant"),
  language: z.enum(["hindi", "english", "hinglish"]).default("hinglish"),
  tone: z.enum(["formal", "friendly", "casual"]).default("friendly"),
  openingHours: z.string().optional(),
  location: z.string().optional(),
  services: z.array(z.object({ name: z.string(), price: z.string().optional() })).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  escalatePhone: z.string().optional(),
  escalateKeywords: z.array(z.string()).default(["complaint", "refund", "urgent"]),
  businessType: z.string().default("business"),
});

// ─── POST: Create a new business + agent config ───────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateBusinessSchema.parse(body);

    // Check if phone already registered
    const existing = await prisma.business.findUnique({
      where: { ownerPhone: data.ownerPhone },
    });
    if (existing) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    const systemPrompt = buildSystemPrompt({
      agentName: data.agentName,
      businessName: data.name,
      businessType: data.businessType,
      services: data.services,
      openingHours: data.openingHours ?? "Please contact us",
      location: data.location ?? "",
      language: data.language,
      tone: data.tone,
      faqs: data.faqs,
      escalateKeywords: data.escalateKeywords,
    });

    const business = await prisma.business.create({
      data: {
        name: data.name,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        config: {
          create: {
            agentName: data.agentName,
            language: data.language,
            tone: data.tone,
            systemPrompt,
            openingHours: data.openingHours,
            location: data.location,
            services: data.services,
            faqs: data.faqs,
            escalatePhone: data.escalatePhone,
            escalateKeywords: data.escalateKeywords,
          },
        },
      },
      include: { config: true },
    });

    return NextResponse.json({ success: true, business }, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET: Fetch business by phone ─────────────────────────
export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const business = await prisma.business.findUnique({
    where: { ownerPhone: phone },
    include: { config: true },
  });

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ business });
}
