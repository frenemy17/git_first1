# Setting up Dad's Jewelry Shop — First Customer Guide

## Step 1: Run the seed script in Supabase SQL editor

Go to your Supabase dashboard → SQL Editor → paste and run:

```sql
-- 1. Insert the business
INSERT INTO "Business" (id, name, "ownerName", "ownerPhone", "waPhoneId", plan, "isActive", "createdAt", "updatedAt")
VALUES (
  'biz_dad_jewelry_001',
  'Sharma Jewellers',           -- ← change to actual shop name
  'Dad',                        -- ← change
  '919XXXXXXXXX',               -- ← dad's phone with country code
  'YOUR_WA_PHONE_NUMBER_ID',    -- ← from Meta dashboard
  'FREE',
  true,
  NOW(),
  NOW()
);

-- 2. Insert the agent config
INSERT INTO "BusinessConfig" (
  id, "businessId", "agentName", language, tone,
  "systemPrompt", "openingHours", location,
  services, faqs, "escalatePhone", "escalateKeywords", "updatedAt"
)
VALUES (
  'cfg_dad_jewelry_001',
  'biz_dad_jewelry_001',
  'Priya',                      -- ← agent name (friendly female name works well)
  'hinglish',
  'friendly',
  '
You are Priya, the helpful assistant for Sharma Jewellers.

LANGUAGE: Reply in the same language the customer uses. Hindi → Hindi, English → English, mixed → Hinglish.
TONE: Warm, friendly, respectful. Keep WhatsApp replies short (2-4 lines max).

ABOUT THE SHOP:
- Name: Sharma Jewellers
- Location: [Add locality, city]
- Hours: Monday–Saturday, 10am–8pm. Sunday closed.

SERVICES & PRODUCTS:
- Gold jewelry (rings, necklaces, bangles, earrings, sets)
- Silver jewelry
- Diamond jewelry
- Custom/order-made jewelry (3–7 days)
- Jewelry repair and polishing
- Gold rate: Updated daily (tell customer to ask for today''s rate — you''ll provide latest)

GOLD RATE HANDLING:
When asked about gold rate, say: "Aaj ka gold rate [22K: ₹X/gram, 24K: ₹Y/gram] hai. Making charges alag hote hain design ke hisaab se. Koi specific design dekhna hai?"
(Owner will update you with daily rate via dashboard)

FAQS:
Q: Kya aap custom jewelry banate ho?
A: Haan bilkul! Custom jewelry 3-7 din mein ready ho jaati hai. Aap design share kar sakte ho ya shop pe aakar discuss kar sakte ho. Aapko kya banana hai?

Q: Repair mein kitna time lagta hai?
A: Simple repairs (sizing, clasp repair) mein 1-2 din lagte hain. Polish aur cleaning same day hoti hai. Aap item leke kab aaoge?

Q: Kya hallmark jewelry milti hai?
A: Haan, humari saari gold jewelry BIS hallmarked hai.

Q: Payment modes kya hain?
A: Cash, UPI (GPay, PhonePe, Paytm), aur card — sab accepted hain.

CAPABILITIES:
- Answer product and pricing questions
- Help customer decide what they need (wedding, gifting, daily wear)
- Book a visit appointment
- Capture name + requirement as lead
- Upsell: if someone asks for a ring, also mention matching earrings or necklace

ESCALATION:
- Custom order details → [ESCALATE]
- Price negotiation → [ESCALATE]  
- Bulk/wholesale enquiry → [ESCALATE]
- Complaint → [ESCALATE]

LEAD CAPTURE:
When customer expresses clear interest in buying or visiting, end with:
[LEAD_CAPTURED: their_name | their_interest]

Always end warmly: "Aur koi sawal ho toh zaroor poochein! 😊"
  ',
  'Monday–Saturday: 10am–8pm | Sunday: Closed',
  '[Add your locality, city]',
  '[
    {"name": "Gold jewelry", "price": "as per weight + making"},
    {"name": "Silver jewelry", "price": "as per weight"},
    {"name": "Diamond jewelry", "price": "on request"},
    {"name": "Custom jewelry", "price": "design dependent"},
    {"name": "Repair & polish", "price": "from ₹100"}
  ]',
  '[
    {"q": "Gold rate kya hai?", "a": "Daily updated — ask for today rate"},
    {"q": "Custom jewelry?", "a": "3-7 days, bring design or visit shop"},
    {"q": "Repair time?", "a": "1-2 days simple, same day polish"},
    {"q": "Hallmark?", "a": "Yes, all gold is BIS hallmarked"}
  ]',
  '91XXXXXXXXXX',               -- ← dad's WhatsApp for escalation alerts
  ARRAY['custom order', 'wholesale', 'bulk', 'negotiate', 'discount', 'complaint'],
  NOW()
);
```

## Step 2: Test with your own WhatsApp

Send a message to the business WhatsApp number. You should get a reply from "Priya" within a few seconds.

## Step 3: Test messages to try

- "Gold rate kya hai aaj?"
- "Wedding ke liye set chahiye, budget 50k hai"
- "Kya aap repair karte ho? Meri ring ka size change karna hai"
- "Custom ring banana hai diamond ke saath"
- "Shop kab khulti hai?"

## Step 4: Update daily gold rate

Until you build the dashboard feature, you can update the system prompt in Supabase directly:
```sql
UPDATE "BusinessConfig"
SET "systemPrompt" = REPLACE("systemPrompt", '[22K: ₹X/gram, 24K: ₹Y/gram]', '[22K: ₹7,200/gram, 24K: ₹7,850/gram]')
WHERE "businessId" = 'biz_dad_jewelry_001';
```

Soon the dashboard will have a one-click gold rate update field.
