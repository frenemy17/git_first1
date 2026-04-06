"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Message = { role: "user" | "agent"; text: string };

const WELCOME = "👋 Hi! I'm here to set up your WhatsApp AI agent. It'll only take 2-3 minutes.\n\nWhat's your name and the name of your business?";

export default function OnboardingPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    
    setPhoneError("");
    setCheckingAuth(true);
    
    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setPhoneError("Connection error: " + (data.error || "Please try again."));
        return;
      }
      
      if (data.exists && data.businessId) {
        // Redirect existing users straight to their dashboard
        router.push(`/dashboard/${data.businessId}`);
      } else {
        // Drop new users into the onboarding AI chat
        setPhoneSubmitted(true);
      }
    } catch {
      setPhoneError("Something went wrong. Please try again.");
    } finally {
      setCheckingAuth(false);
    }
  };

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/agent/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history, phone }),
      });
      const data = await res.json();

      const newHistory = [
        ...history,
        { role: "user", content: userMsg },
        { role: "assistant", content: data.reply },
      ];
      setHistory(newHistory);
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);

      if (data.isComplete && data.businessId) {
        setTimeout(() => router.push(`/dashboard/${data.businessId}`), 2000);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "agent", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!phoneSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Set up your agent</h1>
            <p className="text-gray-500 text-sm">Enter your WhatsApp number to get started.</p>
          </div>
          <input
            type="tel"
            placeholder="91XXXXXXXXXX (with country code)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handlePhoneSubmit}
            disabled={checkingAuth}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {checkingAuth ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Checking...
              </>
            ) : "Continue →"}
          </button>
          {phoneError && <p className="text-xs text-red-500 text-center">{phoneError}</p>}
          <p className="text-xs text-gray-400 text-center">
            This will be your login and escalation number.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">W</div>
        <div>
          <p className="font-semibold text-sm text-gray-900">Wraft Setup</p>
          <p className="text-xs text-green-600">AI is setting up your agent</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
