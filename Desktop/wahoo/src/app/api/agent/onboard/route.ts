// src/app/api/agent/onboard/route.ts
// AI-powered onboarding interview endpoint

import { NextRequest, NextResponse } from "next/server";
import { runOnboardingAgent, buildSystemPrompt } from "@/lib/ai/groq";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { message, history, phone, name } = await req.json();

    if (!message || !phone) {
      return NextResponse.json({ error: "message and phone required" }, { status: 400 });
    }

    const { reply, isComplete, extractedConfig } = await runOnboardingAgent(
      history ?? [],
      message
    );

    // If onboarding is complete, create the business + config
    if (isComplete && extractedConfig) {
      const config = extractedConfig as any;

      // Check if already exists
      const existing = await prisma.business.findUnique({ where: { ownerPhone: phone } });
      if (existing) {
        return NextResponse.json({
          reply: "Your agent is already set up! Visit your dashboard.",
          isComplete: true,
          businessId: existing.id,
        });
      }

      const systemPrompt = buildSystemPrompt({
        agentName: config.agentName ?? "Assistant",
        businessName: config.businessName,
        businessType: config.businessType ?? "business",
        services: config.services ?? [],
        openingHours: config.openingHours ?? "Please contact us",
        location: config.location ?? "",
        language: config.language ?? "hinglish",
        tone: config.tone ?? "friendly",
        faqs: config.faqs ?? [],
        escalateKeywords: config.escalateKeywords ?? ["complaint", "refund", "urgent"],
      });

      const business = await prisma.business.create({
        data: {
          name: config.businessName,
          ownerName: name ?? "Owner",
          ownerPhone: phone,
          config: {
            create: {
              agentName: config.agentName ?? "Assistant",
              language: config.language ?? "hinglish",
              tone: config.tone ?? "friendly",
              systemPrompt,
              openingHours: config.openingHours,
              location: config.location,
              services: config.services ?? [],
              faqs: config.faqs ?? [],
              escalatePhone: config.escalatePhone ?? phone,
              escalateKeywords: config.escalateKeywords ?? ["complaint", "refund"],
            },
          },
        },
      });

      return NextResponse.json({
        reply: `🎉 Your AI agent is ready! Your agent is set up for *${config.businessName}*. Visit your dashboard to connect your WhatsApp number.`,
        isComplete: true,
        businessId: business.id,
      });
    }

    return NextResponse.json({ reply, isComplete: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
