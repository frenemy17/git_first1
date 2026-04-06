"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Lead = {
  id: string;
  customerPhone: string;
  customerName: string | null;
  interest: string | null;
  status: string;
  createdAt: string;
};

type Stats = { totalLeads: number; newLeads: number; totalConversations: number };
type Business = { id: string; name: string; ownerName: string; config: { agentName: string; language: string; tone: string; openingHours: string | null; location: string | null } | null };

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "settings">("overview");

  useEffect(() => {
    fetch(`/api/business/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBusiness(data.business);
        setStats(data.stats);
        setLeads(data.recentLeads);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Business not found.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">W</div>
          <div>
            <p className="font-semibold text-gray-900">{business.name}</p>
            <p className="text-xs text-gray-400">Agent: {business.config?.agentName ?? "Assistant"}</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Live</span>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {(["overview", "leads", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition capitalize ${
                activeTab === tab ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total leads", value: stats?.totalLeads ?? 0, color: "text-green-600" },
                { label: "New leads", value: stats?.newLeads ?? 0, color: "text-amber-600" },
                { label: "Conversations", value: stats?.totalConversations ?? 0, color: "text-blue-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp connect banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-green-800 text-sm">Connect your WhatsApp number</p>
                <p className="text-green-700 text-xs mt-1">
                  Go to Meta for Developers → Your App → WhatsApp → Add phone number, then set your webhook to:
                </p>
                <code className="text-xs bg-green-100 text-green-900 px-2 py-1 rounded mt-2 block">
                  {process.env.NEXT_PUBLIC_APP_URL ?? "https://your-app.vercel.app"}/api/webhook
                </code>
              </div>
              <a
                href="https://developers.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
              >
                Open Meta →
              </a>
            </div>

            {/* Recent leads preview */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm">Recent leads</h2>
                <button onClick={() => setActiveTab("leads")} className="text-xs text-green-600 hover:underline">View all</button>
              </div>
              {leads.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No leads yet — share your WhatsApp number to get started</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {leads.slice(0, 5).map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">All leads ({leads.length})</h2>
            </div>
            {leads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No leads captured yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} showFull />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && business.config && (
          <SettingsPanel businessId={id} config={business.config} />
        )}
      </div>
    </main>
  );
}

function LeadRow({ lead, showFull }: { lead: Lead; showFull?: boolean }) {
  const statusColors: Record<string, string> = {
    NEW: "bg-amber-100 text-amber-700",
    CONTACTED: "bg-blue-100 text-blue-700",
    CONVERTED: "bg-green-100 text-green-700",
    LOST: "bg-gray-100 text-gray-500",
  };
  return (
    <div className="px-5 py-3.5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {lead.customerName ?? lead.customerPhone}
        </p>
        {showFull && lead.customerName && (
          <p className="text-xs text-gray-400">{lead.customerPhone}</p>
        )}
        {lead.interest && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{lead.interest}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[lead.status] ?? "bg-gray-100 text-gray-500"}`}>
          {lead.status}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
      </div>
    </div>
  );
}

function SettingsPanel({
  businessId,
  config,
}: {
  businessId: string;
  config: { agentName: string; language: string; tone: string; openingHours: string | null; location: string | null };
}) {
  const [form, setForm] = useState({ ...config });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/business/${businessId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="font-semibold text-gray-900">Agent settings</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Agent name</label>
          <input
            value={form.agentName}
            onChange={(e) => setForm({ ...form, agentName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Language</label>
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="hinglish">Hinglish</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Tone</label>
          <select
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Opening hours</label>
          <input
            value={form.openingHours ?? ""}
            onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Mon–Sat: 10am–8pm"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-medium text-gray-600">Location</label>
          <input
            value={form.location ?? ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Shop 12, Main Market, Sonipat"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}
