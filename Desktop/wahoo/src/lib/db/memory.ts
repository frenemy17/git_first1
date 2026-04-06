// src/lib/db/memory.ts
// Upstash Redis — stores last N messages per conversation

import { Redis } from "@upstash/redis";
import type { Message } from "@/lib/ai/groq";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MAX_HISTORY = 10;           // last 10 messages kept in memory
const TTL_SECONDS = 60 * 60 * 24; // 24 hours

// ─── Key format: wraft:conv:{businessId}:{customerPhone} ──
function key(businessId: string, customerPhone: string): string {
  return `wraft:conv:${businessId}:${customerPhone}`;
}

// ─── Get conversation history ─────────────────────────────
export async function getHistory(
  businessId: string,
  customerPhone: string
): Promise<Message[]> {
  const data = await redis.get<Message[]>(key(businessId, customerPhone));
  return data ?? [];
}

// ─── Append messages and trim to MAX_HISTORY ─────────────
export async function appendMessages(
  businessId: string,
  customerPhone: string,
  newMessages: Message[]
): Promise<void> {
  const existing = await getHistory(businessId, customerPhone);
  const updated = [...existing, ...newMessages].slice(-MAX_HISTORY);
  await redis.set(key(businessId, customerPhone), updated, { ex: TTL_SECONDS });
}

// ─── Clear a conversation (on escalation or close) ───────
export async function clearHistory(
  businessId: string,
  customerPhone: string
): Promise<void> {
  await redis.del(key(businessId, customerPhone));
}
