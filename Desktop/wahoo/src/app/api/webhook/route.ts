// src/app/api/webhook/route.ts
// WhatsApp Cloud API webhook — entry point for all incoming messages

import { NextRequest, NextResponse } from "next/server";
import { parseWebhookMessage, sendTextMessage, markAsRead } from "@/lib/whatsapp/client";
import { runAgent, buildSystemPrompt } from "@/lib/ai/groq";
import { getHistory, appendMessages, clearHistory } from "@/lib/db/memory";
import prisma from "@/lib/db/prisma";

// ─── GET: Meta webhook verification ──────────────────────
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// ─── POST: Incoming messages from WhatsApp ────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Always return 200 fast — Meta will retry if we're slow
  const parsed = parseWebhookMessage(body);
  if (!parsed) return NextResponse.json({ status: "ok" });

  const { phoneNumberId, from, messageId, text } = parsed;

  // Process async (don't block the 200 response)
  handleMessage({ phoneNumberId, from, messageId, text }).catch(console.error);

  return NextResponse.json({ status: "ok" });
}

// ─── Core message handler ─────────────────────────────────
async function handleMessage({
  phoneNumberId,
  from,
  messageId,
  text,
}: {
  phoneNumberId: string;
  from: string;
  messageId: string;
  text: string;
}) {
  // 1. Find which business owns this WhatsApp number
  const business = await prisma.business.findUnique({
    where: { waPhoneId: phoneNumberId },
    include: { config: true },
  });

  if (!business || !business.config || !business.isActive) {
    console.warn(`No active business found for phoneNumberId: ${phoneNumberId}`);
    return;
  }

  const { config } = business;

  // 2. Get or create conversation in DB
  let conversation = await prisma.conversation.findFirst({
    where: {
      businessId: business.id,
      customerPhone: from,
      status: "ACTIVE",
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        businessId: business.id,
        customerPhone: from,
        status: "ACTIVE",
      },
    });
  }

  // 3. Save incoming message to DB
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: text,
      waMessageId: messageId,
    },
  });

  // 4. Mark as read
  await markAsRead(phoneNumberId, process.env.WHATSAPP_ACCESS_TOKEN!, messageId);

  // 5. Get conversation history from Redis
  const history = await getHistory(business.id, from);

  // 6. Build system prompt from business config
  const systemPrompt = config.systemPrompt || buildSystemPrompt({
    agentName: config.agentName,
    businessName: business.name,
    businessType: "business",
    services: (config.services as any[]) ?? [],
    openingHours: config.openingHours ?? "Please contact us",
    location: config.location ?? "",
    language: config.language,
    tone: config.tone,
    faqs: (config.faqs as any[]) ?? [],
    escalateKeywords: config.escalateKeywords,
  });

  // 7. Run the AI agent
  const agentReply = await runAgent(systemPrompt, history, text);

  // 8. Handle special agent signals
  let cleanReply = agentReply;
  let shouldEscalate = false;
  let leadInfo: { name?: string; interest?: string } | null = null;

  if (agentReply.includes("[ESCALATE]")) {
    cleanReply = agentReply.replace("[ESCALATE]", "").trim();
    shouldEscalate = true;
  }

  const leadMatch = agentReply.match(/\[LEAD_CAPTURED:\s*([^|]+)\|\s*([^\]]+)\]/);
  if (leadMatch) {
    cleanReply = agentReply.replace(leadMatch[0], "").trim();
    leadInfo = { name: leadMatch[1].trim(), interest: leadMatch[2].trim() };
  }

  // 9. Send reply to customer
  await sendTextMessage(
    phoneNumberId,
    process.env.WHATSAPP_ACCESS_TOKEN!,
    from,
    cleanReply
  );

  // 10. Save agent reply to DB
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "AGENT",
      content: cleanReply,
    },
  });

  // 11. Update Redis history
  await appendMessages(business.id, from, [
    { role: "user", content: text },
    { role: "assistant", content: cleanReply },
  ]);

  // 12. Capture lead if signaled
  if (leadInfo) {
    await prisma.lead.upsert({
      where: { conversationId: conversation.id },
      create: {
        businessId: business.id,
        conversationId: conversation.id,
        customerPhone: from,
        customerName: leadInfo.name,
        interest: leadInfo.interest,
        status: "NEW",
      },
      update: {
        customerName: leadInfo.name,
        interest: leadInfo.interest,
      },
    });

    // Update customer name in conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { customerName: leadInfo.name },
    });
  }

  // 13. Escalate to owner if needed
  if (shouldEscalate && config.escalatePhone) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "ESCALATED" },
    });
    await clearHistory(business.id, from);

    // Notify owner on WhatsApp
    const ownerNotification = `🔔 *New escalation — ${business.name}*\n\nCustomer: ${from}\nMessage: "${text}"\n\nPlease follow up directly.`;
    await sendTextMessage(
      phoneNumberId,
      process.env.WHATSAPP_ACCESS_TOKEN!,
      config.escalatePhone,
      ownerNotification
    );
  }
}
