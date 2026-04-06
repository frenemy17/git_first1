// src/lib/ai/groq.ts
// Wraft AI engine — powered by Groq (Llama 3.3 70B)

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

// ─── Core agent chat function ─────────────────────────────
export async function runAgent(
  systemPrompt: string,
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    max_tokens: 500,       // keep replies concise for WhatsApp
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? "Sorry, I could not process that. Please try again.";
}

// ─── Onboarding interview agent ───────────────────────────
export async function runOnboardingAgent(
  conversationHistory: Message[],
  userMessage: string
): Promise<{ reply: string; isComplete: boolean; extractedConfig?: object }> {
  const systemPrompt = `You are an onboarding assistant for Wraft — a WhatsApp AI agent platform.
Your job is to interview a business owner and collect information to set up their AI agent.

Collect the following in a natural, friendly conversation (in the language they use):
1. Business name
2. Type of business (salon, clinic, jewelry shop, etc.)
3. Services/products offered (with rough prices if possible)
4. Working hours
5. Location / area
6. Preferred language for the agent (Hindi, English, or Hinglish)
7. Tone (formal or friendly)
8. Any FAQs they get often
9. Their WhatsApp number for escalation (complex queries)

Ask 1-2 questions at a time. Be warm and conversational — not like a form.

When you have ALL the information, respond with exactly this JSON format (nothing else):
SETUP_COMPLETE:{"businessName":"...","businessType":"...","services":[...],"openingHours":"...","location":"...","language":"...","tone":"...","faqs":[{"q":"...","a":"..."}],"escalatePhone":"..."}`;

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    max_tokens: 800,
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content?.trim() ?? "";

  if (content.startsWith("SETUP_COMPLETE:")) {
    try {
      const jsonStr = content.replace("SETUP_COMPLETE:", "");
      const extractedConfig = JSON.parse(jsonStr);
      return { reply: "Setup complete!", isComplete: true, extractedConfig };
    } catch {
      return { reply: content, isComplete: false };
    }
  }

  return { reply: content, isComplete: false };
}

// ─── System prompt generator ──────────────────────────────
export function buildSystemPrompt(config: {
  agentName: string;
  businessName: string;
  businessType: string;
  services: Array<{ name: string; price?: string }>;
  openingHours: string;
  location: string;
  language: string;
  tone: string;
  faqs: Array<{ q: string; a: string }>;
  escalateKeywords: string[];
}): string {
  const servicesList = config.services
    .map((s) => `- ${s.name}${s.price ? ` (${s.price})` : ""}`)
    .join("\n");

  const faqsList = config.faqs
    .map((f) => `Q: ${f.q}\nA: ${f.a}`)
    .join("\n\n");

  return `You are ${config.agentName}, the AI assistant for ${config.businessName} — a ${config.businessType}.

LANGUAGE: Respond in ${config.language}. If the customer writes in Hindi, reply in Hindi. If English, reply in English. Match their language naturally.
TONE: ${config.tone}. Be warm, helpful, and concise. This is WhatsApp — keep replies short (2-4 sentences max unless listing products).

ABOUT THE BUSINESS:
- Name: ${config.businessName}
- Type: ${config.businessType}
- Location: ${config.location}
- Hours: ${config.openingHours}

SERVICES / PRODUCTS:
${servicesList}

FREQUENTLY ASKED QUESTIONS:
${faqsList}

YOUR CAPABILITIES:
- Answer questions about products, services, pricing, and hours
- Help customers book appointments or visits
- Capture their name and requirement as a lead
- Recommend the right product/service based on their need

ESCALATION RULES:
- If the customer asks about: ${config.escalateKeywords.join(", ")} — tell them "Let me connect you with our team" and end with [ESCALATE]
- If the customer seems ready to buy or visit — end your message with [LEAD_CAPTURED: their_name | their_interest]
- Never make up prices or information you don't have — say "I'll check with our team"
- Never discuss competitors

Always end conversations warmly. You represent ${config.businessName}.`;
}
