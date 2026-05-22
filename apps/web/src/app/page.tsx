'use client';

import React from 'react';
import { Calendar, Shield, Cpu, RefreshCw, Zap, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden relative">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl shadow-lg">
            C
          </div>
          <span className="text-xl font-bold tracking-tight">CalClone</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#architecture" className="hover:text-white transition">Architecture</a>
          <a href="#roadmap" className="hover:text-white transition">Roadmap</a>
        </nav>
        <div>
          <a 
            href="/login" 
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sm font-medium border border-zinc-800 transition"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-grow flex flex-col justify-center items-center text-center py-20 z-10">
        
        {/* Spec Link Alert */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Monorepo Structure Scaffolding Active
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          Scheduling Infrastructure <br />
          <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Built for the Modern Web
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 font-light">
          A production-grade, self-hosted scheduling platform engineered in Next.js 15, TypeScript, and Express. Simple, timezone-resilient, and race-condition free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <a 
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-base hover:bg-zinc-200 transition shadow-xl"
          >
            Launch Core Dashboard
          </a>
          <a 
            href="/PRODUCT_PLANNING.md"
            target="_blank"
            className="px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-semibold text-base border border-zinc-800 flex items-center justify-center gap-2 transition"
          >
            Read System Architecture <ExternalLink size={18} />
          </a>
        </div>

        {/* Dynamic Mockup Showcase */}
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-3 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-950/60 rounded-t-xl text-zinc-500 text-xs">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/30" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
              <span className="w-3 h-3 rounded-full bg-green-500/30" />
            </div>
            <span>cal-clone.yuvraj.app/dashboard</span>
            <div className="w-4" />
          </div>
          
          <div className="p-8 grid md:grid-cols-3 gap-6 bg-zinc-950/20 text-left">
            {/* Sidebar mock */}
            <div className="hidden md:flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="h-6 w-24 bg-zinc-800 rounded mb-4" />
              <div className="h-8 bg-white/10 rounded-lg flex items-center px-3 gap-2 text-xs font-semibold">
                <Calendar size={14} /> Event Types
              </div>
              <div className="h-8 bg-zinc-900 rounded-lg flex items-center px-3 gap-2 text-xs text-zinc-400">
                <RefreshCw size={14} /> Availability
              </div>
              <div className="h-8 bg-zinc-900 rounded-lg flex items-center px-3 gap-2 text-xs text-zinc-400">
                <Shield size={14} /> Bookings
              </div>
            </div>

            {/* Core Card Mock */}
            <div className="col-span-2 p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/40 flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">15-Minute Strategic Call</h3>
                <p className="text-zinc-500 text-xs mb-4">cal-clone.yuvraj.app/yuvraj/15min</p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-zinc-800/60 text-[10px] text-zinc-300 border border-zinc-700/50">15 Min</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950/40 text-[10px] text-emerald-400 border border-emerald-900/50">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4">
                <span className="text-xs text-zinc-400">Next Slot: Monday, 9:00 AM</span>
                <span className="text-xs text-zinc-500">Asia/Kolkata</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Highlights Section */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-900">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-zinc-800 flex items-center justify-center text-white mb-6">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-lg mb-3">Timezone Resiliency</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every scheduling transaction takes place in absolute UTC. The dynamic backend mapping service recalculates host slots seamlessly to accommodate guest time zones perfectly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-zinc-800 flex items-center justify-center text-white mb-6">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-lg mb-3">Race-Condition Mitigation</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Prevents double-booking conflicts instantly. Concurrency is resolved via Upstash Redis distributed locks and atomic Mongo transaction operations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-zinc-800 flex items-center justify-center text-white mb-6">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg mb-3">Next.js 15 Monorepo</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              An enterprise monorepo workspace. Shares clean TypeScript contracts and schema data between client modules and the RESTful Express application server.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <span>&copy; 2026 CalClone SDE Internship Project submission.</span>
          <div className="flex gap-6">
            <a href="/PRODUCT_PLANNING.md" className="hover:text-white transition">Product Specs</a>
            <a href="https://cal.com" target="_blank" className="hover:text-white transition">Cal.com</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
