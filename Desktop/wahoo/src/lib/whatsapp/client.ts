// src/lib/whatsapp/client.ts
// WhatsApp Cloud API wrapper

import axios from "axios";

const BASE_URL = "https://graph.facebook.com/v19.0";

export type IncomingMessage = {
  from: string;        // customer phone number
  id: string;          // WA message ID
  text?: { body: string };
  type: string;
};

export type WebhookPayload = {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { phone_number_id: string };
        messages?: IncomingMessage[];
        statuses?: Array<{ id: string; status: string }>;
      };
      field: string;
    }>;
  }>;
};

// ─── Send a text message ──────────────────────────────────
export async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  message: string
): Promise<void> {
  await axios.post(
    `${BASE_URL}/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// ─── Parse incoming webhook payload ──────────────────────
export function parseWebhookMessage(body: WebhookPayload): {
  phoneNumberId: string;
  from: string;
  messageId: string;
  text: string;
} | null {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text" || !message.text) return null;

    return {
      phoneNumberId: value.metadata.phone_number_id,
      from: message.from,
      messageId: message.id,
      text: message.text.body,
    };
  } catch {
    return null;
  }
}

// ─── Mark message as read ─────────────────────────────────
export async function markAsRead(
  phoneNumberId: string,
  accessToken: string,
  messageId: string
): Promise<void> {
  await axios.post(
    `${BASE_URL}/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}
