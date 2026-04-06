"use client";

import React, { useState } from 'react';
import { Bot, MessageSquare, Zap, Target, BookOpen, UserPlus, CheckCircle2, ShieldCheck, ArrowRight, CornerDownRight } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setEmail(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink overflow-x-hidden selection:bg-accent-neon selection:text-black font-sans">
      
      {/* Background Glows & Noise */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple/30 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-accent-neon/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-accent-green/20 blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="w-full border-b border-borderGlow bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-neon to-accent-purple p-[1px]">
              <div className="w-full h-full bg-background/90 rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-accent-neon" />
              </div>
            </div>
            <span className="font-bold tracking-widest uppercase text-sm">Wraft</span>
          </div>
          <a href="/onboarding" className="text-sm font-semibold text-ink-muted hover:text-accent-neon transition-colors">Sign In</a>
        </div>
      </nav>

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* 1. HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface border border-borderGlow rounded-full backdrop-blur-md mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-neon"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-ink-muted uppercase">Early Access Private Beta</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-up max-w-4xl" style={{ animationDelay: '0.1s' }}>
            Hire a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-neon via-accent-purple to-accent-neon bg-[length:200%_auto] animate-pulse-slow">24/7 Digital Employee</span><br />
            for Your WhatsApp.
          </h1>
          
          <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-3xl font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The world's easiest AI agent platform for local businesses. Talk to our onboarding AI, and we'll deploy a fully custom, lead-capturing WhatsApp assistant for your shop in 5 minutes.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mb-20 relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-neon to-accent-purple rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative flex w-full p-1 bg-background rounded-xl border border-borderGlow backdrop-blur-xl">
              <input 
                type="email" 
                placeholder="Enter your email address"
                required
                readOnly={submitted}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-ink-faint text-ink"
              />
              <button 
                type="submit"
                disabled={submitted}
                className="bg-ink hover:bg-ink-muted text-background text-sm font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitted ? <><CheckCircle2 className="w-4 h-4 text-accent-green" /> Joined</> : 'Join the Exclusive Waitlist'}
              </button>
            </div>
          </form>

          {/* Hero Graphic: Split Screen Mockup */}
          <div className="w-full max-w-5xl mx-auto bg-surface border border-borderGlow rounded-2xl p-4 md:p-8 backdrop-blur-md shadow-2xl relative animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
            
            <div className="grid md:grid-cols-2 gap-8 relative items-center">
              {/* Left: Onboarding Interview */}
              <div className="bg-background rounded-xl border border-borderGlow p-6 h-[300px] flex flex-col shadow-inner relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderGlow">
                  <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center"><Bot className="w-4 h-4 text-accent-purple" /></div>
                  <div className="text-left font-semibold text-sm">Onboarding Consultant AI</div>
                </div>
                <div className="flex-1 overflow-hidden space-y-4 flex flex-col justify-end pointer-events-none">
                  <div className="bg-surface rounded-xl rounded-tl-sm p-3 text-sm border border-borderGlow w-5/6 shadow-sm self-start">
                    Hello! Let's set up your custom AI. What's the live gold rate today, and do you offer making charge discounts?
                  </div>
                  <div className="bg-zinc-800 rounded-xl rounded-tr-sm p-3 text-sm border border-borderGlow text-white w-5/6 shadow-sm self-end">
                    Rate is ₹7,850/g. We rarely discount making charges, but for orders over 50g we can do 5% off.
                  </div>
                </div>
                {/* Fade out bottom text */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent"></div>
              </div>

              {/* Right: WhatsApp Output */}
              <div className="bg-background rounded-xl border border-borderGlow p-6 h-[300px] flex flex-col shadow-inner relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderGlow">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-[#25D366]" /></div>
                  <div className="text-left font-semibold text-sm">Customer WhatsApp Chat</div>
                </div>
                <div className="flex-1 overflow-hidden space-y-4 flex flex-col justify-end pointer-events-none">
                  <div className="bg-zinc-800 rounded-xl rounded-tr-sm p-3 text-sm border border-borderGlow text-white w-5/6 shadow-sm self-end">
                    I want to buy 60g of 24K gold chain. Can you give a discount?
                  </div>
                  <div className="bg-surface rounded-xl rounded-tl-sm p-3 text-sm border border-borderGlow w-5/6 shadow-sm self-start relative">
                    <span className="w-1 h-full absolute left-0 top-0 bg-accent-neon rounded-l-xl"></span>
                    Yes sir! The rate today is ₹7,850/g. Since your order is over 50g, I can offer you a special 5% discount on the making charges. Should I book an appointment for you?
                  </div>
                </div>
                {/* Fade out bottom text */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              
              {/* Connector */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-surface rounded-full border border-borderGlow items-center justify-center shadow-lg z-10 backdrop-blur-xl">
                <ArrowRight className="w-5 h-5 text-accent-neon" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURE SHOWCASE (The Magic) */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Magic Behind Wraft</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface border border-borderGlow rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group hover:border-accent-purple/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 blur-[50px] rounded-full group-hover:bg-accent-purple/30"></div>
              <BookOpen className="w-8 h-8 text-accent-purple mb-6" />
              <h3 className="text-xl font-bold mb-3">Zero-Setup Prompt Generation</h3>
              <p className="text-ink-muted text-sm leading-relaxed">No coding. Just chat with our onboarding AI, and it automatically writes the perfect instruction handbook for your business.</p>
            </div>

            <div className="bg-surface border border-borderGlow rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group hover:border-accent-neon/50 transition-colors">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-neon/10 blur-[50px] rounded-full group-hover:bg-accent-neon/30"></div>
              <MessageSquare className="w-8 h-8 text-accent-neon mb-6" />
              <h3 className="text-xl font-bold mb-3">Multimodal Language Support</h3>
              <p className="text-ink-muted text-sm leading-relaxed">Speaks to your customers exactly how they speak. Fluent in Hindi, English, and Hinglish for unmatched local rapport.</p>
            </div>

            <div className="bg-surface border border-borderGlow rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group hover:border-accent-green/50 transition-colors">
              <div className="absolute top-1/2 right-1/2 w-32 h-32 bg-accent-green/10 blur-[50px] rounded-full group-hover:bg-accent-green/30"></div>
              <UserPlus className="w-8 h-8 text-accent-green mb-6" />
              <h3 className="text-xl font-bold mb-3">Smart Escalation & Lead Capture</h3>
              <p className="text-ink-muted text-sm leading-relaxed">Never miss a sale. Captures names and intent automatically, and instantly escalates complex negotiations directly to your phone.</p>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS (The Pipeline) */}
        <section className="max-w-6xl mx-auto px-6 mb-32 pt-10">
          <h2 className="text-3xl font-bold text-center tracking-tight mb-20 uppercase text-ink-muted">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative text-center">
            {/* Horizontal Line Stepper */}
            <div className="hidden md:block absolute top-[44px] left-32 right-32 h-px bg-borderGlow -z-10"></div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface border border-borderGlow backdrop-blur-xl flex flex-col items-center justify-center mb-6 shadow-lg shadow-accent-purple/5 relative">
                <span className="absolute -top-3 -right-3 text-sm font-bold text-accent-purple bg-background border border-borderGlow w-8 h-8 rounded-full flex items-center justify-center shadow-lg">1</span>
                <MessageSquare className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2">Interview</h3>
              <p className="text-ink-muted text-sm">We chat with you to learn your business.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface border border-borderGlow backdrop-blur-xl flex flex-col items-center justify-center mb-6 shadow-lg shadow-accent-neon/5 relative">
                <span className="absolute -top-3 -right-3 text-sm font-bold text-accent-neon bg-background border border-borderGlow w-8 h-8 rounded-full flex items-center justify-center shadow-lg">2</span>
                <Bot className="w-8 h-8 text-accent-neon" />
              </div>
              <h3 className="text-lg font-bold mb-2">Synthesize</h3>
              <p className="text-ink-muted text-sm">We generate your custom AI knowledge base.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface border border-borderGlow backdrop-blur-xl flex flex-col items-center justify-center mb-6 shadow-lg shadow-accent-green/5 relative">
                <span className="absolute -top-3 -right-3 text-sm font-bold text-accent-green bg-background border border-borderGlow w-8 h-8 rounded-full flex items-center justify-center shadow-lg">3</span>
                <Zap className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-lg font-bold mb-2">Deploy</h3>
              <p className="text-ink-muted text-sm">Your AI goes live on WhatsApp instantly.</p>
            </div>
          </div>
        </section>

        {/* 4. TECH & TRUST BADGES */}
        <section className="max-w-4xl mx-auto px-6 mb-32 opacity-70">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-ink-faint mb-8">Engineering Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
             <div className="text-xl font-bold text-ink-muted tracking-tighter">LLAMA 3 // GROQ</div>
             <div className="text-xl font-bold text-ink-muted tracking-tighter flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-ink-muted"></div> META WHATSAPP API</div>
             <div className="text-xl font-bold text-ink-muted tracking-tighter">SUPABASE</div>
          </div>
        </section>

        {/* 5. FOOTER / FINAL WAITLIST PUSH */}
        <section className="relative px-6 py-32 mt-20 border-t border-borderGlow overflow-hidden">
          {/* Subtle mesh background */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/10 to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
              Local Businesses are entering the AI Era. Don't fall behind.
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full mx-auto justify-center mb-16">
              <input 
                type="email" 
                placeholder="Business Email"
                required
                readOnly={submitted}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-background border border-borderGlow rounded-lg px-6 py-4 text-sm focus:outline-none focus:border-accent-neon transition-colors shadow-inner flex-1 max-w-[300px]"
              />
              <button 
                type="submit"
                disabled={submitted}
                className="bg-accent-neon hover:bg-accent-neon/80 text-background font-bold px-8 py-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitted ? 'Joined!' : 'Get Early Access'}
              </button>
            </form>
          </div>
          
          <div className="max-w-6xl mx-auto pt-12 border-t border-borderGlow/50 flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-ink-faint mb-4" />
            <span className="text-xs text-ink-faint uppercase tracking-widest font-bold">Wraft Systems Inc.</span>
            <span className="text-xs text-ink-faint mt-2">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </section>
        
      </main>
    </div>
  );
}
