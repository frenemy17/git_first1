// src/app/api/business/[id]/route.ts
// Update business config (from dashboard)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { buildSystemPrompt } from "@/lib/ai/groq";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: { config: true },
    });
    if (!business || !business.config) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Rebuild system prompt if knowledge fields changed
    const needsRebuild =
      body.services || body.faqs || body.language || body.tone ||
      body.openingHours || body.location || body.agentName;

    const merged = {
      agentName: body.agentName ?? business.config.agentName,
      businessName: business.name,
      businessType: body.businessType ?? "business",
      services: body.services ?? (business.config.services as any[]) ?? [],
      openingHours: body.openingHours ?? business.config.openingHours ?? "",
      location: body.location ?? business.config.location ?? "",
      language: body.language ?? business.config.language,
      tone: body.tone ?? business.config.tone,
      faqs: body.faqs ?? (business.config.faqs as any[]) ?? [],
      escalateKeywords: body.escalateKeywords ?? business.config.escalateKeywords,
    };

    const updatedConfig = await prisma.businessConfig.update({
      where: { businessId: id },
      data: {
        ...body,
        systemPrompt: needsRebuild ? buildSystemPrompt(merged) : undefined,
      },
    });

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET: Dashboard stats for a business ─────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [business, totalLeads, newLeads, totalConversations, recentLeads] =
    await Promise.all([
      prisma.business.findUnique({ where: { id }, include: { config: true } }),
      prisma.lead.count({ where: { businessId: id } }),
      prisma.lead.count({ where: { businessId: id, status: "NEW" } }),
      prisma.conversation.count({ where: { businessId: id } }),
      prisma.lead.findMany({
        where: { businessId: id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    business,
    stats: { totalLeads, newLeads, totalConversations },
    recentLeads,
  });
}
