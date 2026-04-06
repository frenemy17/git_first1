# Wraft 🟢

Wraft is a multi-tenant WhatsApp AI Agent platform designed to help small businesses automate customer support, capture leads, and manage conversations directly on WhatsApp. Powered by Groq, Prisma, and Next.js.

## What is Done
- **Database Architecture**: Comprehensive PostgreSQL schema supporting Multi-tenant Businesses, AI Configurations, Conversations, and Leads.
- **AI Engine Integration**: Integrated with Groq (Llama 3.3 70B) for ultra-fast, contextual response generation.
- **Dynamic System Prompts**: Automatically generates custom instructions based on business domain, FAQs, and tone.
- **In-Memory/Redis Conversation State**: Fast retrieval of active user conversations to retain recent conversational context.
- **Landing & Onboarding UI**: Next.js App Router interfaces for businesses to sign up and configure their Wraft AI agents.

## What is Not Done
- **WhatsApp Webhook Integration**: Complete connection with Meta Cloud API for live message sending/receiving is pending.
- **Owner Dashboard**: Detailed analytics / lead management interface for business owners.
- **Billing/Stripe**: Subscription limits (Free, Basic, Pro) and paywalls are not fully enforced yet.
- **AI Analytics**: Advanced extraction of customer intent vs basic lead capture.

## Userflow
1. **Onboarding**: A Business Owner visits the Wraft site and completes the onboarding flow. They provide their business name, tone, language preference (e.g. hinglish), faqs, services, and an escalation number.
2. **AI Generation**: Wraft creates an internal `BusinessConfig` dictating the AI's persona and logic rules. 
3. **Customer Interaction**: A customer messages the business's WhatsApp number.
4. **Processing**: Wraft receives the message, looks up the specific business's system prompt, pulls the conversation history, and forwards the payload to Groq.
5. **Response & Lead Capture**: The AI replies accurately. If the AI detects purchasing intent or an escalated query, it updates the `Lead` status and notifies the owner.

## System Architecture
- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL hosted on Supabase (using Prisma ORM)
- **Caching & State**: Upstash Redis / In-memory tracking for fast conversation retrieval
- **AI Inference**: Groq (Llama models) for low-latency generation
- **Styling**: Tailwind CSS & Lucide Icons
- **Auth**: Next-Auth for Business Owner credential management

## Setup Guide

### 1. Prerequisites
- Node.js v18+
- PostgreSQL Database URI (e.g., Supabase)
- Groq API Key

### 2. Environment Variables
Create a `.env` file in the root directory (use the provided `.env.example` if available) and add:
```env
DATABASE_URL="your-postgres-url"
DIRECT_URL="your-postgres-direct-connection-url"
GROQ_API_KEY="your-groq-key"
# Add NEXTAUTH_SECRET and NEXTAUTH_URL if working on Auth
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
Generate the Prisma Client and push the schema to your database.
```bash
npm run db:generate
npm run db:push
```

### 5. Running Locally
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.
