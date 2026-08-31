import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Sparkles, 
  Binary, 
  CheckCircle2, 
  ArrowDown, 
  Lock, 
  Zap, 
  ShieldAlert, 
  FileKey,
  Flame
} from 'lucide-react';

interface SceneProps {
  progress: number; // 0 to 1
}

export function Scene2SubstrateArchitecture({ progress }: SceneProps) {
  const activeEngineIndex = Math.min(3, Math.floor(progress * 4));

  const engines = [
    {
      name: 'Canon Lane (Mass: ∞)',
      role: 'Immutable policy and enterprise identity locking.',
      stat: '0.12ms Latency',
      badge: 'GROUND TRUTH ANCHOR',
      icon: Lock,
      color: 'emerald',
      activeColor: 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
    },
    {
      name: 'Contradiction Engine (Dual-Lane NLI)',
      role: 'Detects polarity clashes and semantic divergence in sub-milliseconds.',
      stat: '0.28ms Latency',
      badge: 'POLARITY CLASH DETECTOR',
      icon: Zap,
      color: 'indigo',
      activeColor: 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300'
    },
    {
      name: 'Cranium Immune Layer',
      role: 'Quarantine-first belief purge for injections and toxic counter-axioms.',
      stat: '0.18ms Latency',
      badge: 'ACTIVE PURGE & REPEL',
      icon: ShieldAlert,
      color: 'rose',
      activeColor: 'bg-rose-950/40 border-rose-500/60 text-rose-300'
    },
    {
      name: 'Cryptographic Audit Pipeline',
      role: 'Generates SHA-256 verifiable receipts for every cognitive cycle.',
      stat: '0.09ms Latency',
      badge: 'VERIFIABLE RECEIPT EMITTER',
      icon: FileKey,
      color: 'amber',
      activeColor: 'bg-amber-950/40 border-amber-500/60 text-amber-300'
    }
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-neutral-950 text-neutral-200 overflow-hidden select-none font-mono">
      {/* Background Grid with Glowing Indigo Aura */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-1.5">
            Act II: Introducing Cranium Substrate™
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center gap-1">
            <Binary size={12} /> SUB-MILLISECOND DETERMINISTIC LAYER
          </span>
        </div>
      </div>

      {/* Main Dynamic Visual: Three-Tier Sandwiched Stack Architecture */}
      <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Sandwiched Architectural Diagram */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1.5 font-sans">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              <ShieldCheck size={13} className="text-indigo-400" />
              <span>THE COGNITIVE GOVERNANCE FOUNDATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-tight">
              Deterministic governance <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-200">above models</span>, below apps.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Acts as an unbreakable kernel filter guaranteeing truth, identity permanence, and canon permanence.
            </p>
          </div>

          {/* Interactive Stack Visualizer */}
          <div className="space-y-2 font-mono text-xs">
            {/* Top Layer: Applications */}
            <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Layers size={16} className="text-indigo-400" />
                <span className="font-medium">Enterprise Workflows & Applications</span>
              </div>
              <span className="text-[10px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                CONSUMER LAYER
              </span>
            </div>

            {/* Downward Data Flow Indicator */}
            <div className="flex justify-center text-indigo-400 py-0.5">
              <div className="flex items-center gap-1 text-[10px] bg-indigo-950/60 px-3 py-0.5 rounded-full border border-indigo-800/40 animate-pulse">
                <ArrowDown size={11} /> <span>INTERCEPTED & GOVERNED IN REAL TIME</span> <ArrowDown size={11} />
              </div>
            </div>

            {/* Middle Layer: CRANIUM SUBSTRATE (Hero Highlight) */}
            <div className="p-4 rounded-xl border-2 border-indigo-500/80 bg-gradient-to-r from-indigo-950/90 via-blue-950/90 to-indigo-950/90 text-indigo-100 shadow-[0_0_30px_rgba(99,102,241,0.3)] space-y-2 ring-1 ring-indigo-400/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white tracking-wide text-sm">
                  <div className="p-1 rounded-md bg-indigo-500 text-black">
                    <Sparkles size={14} />
                  </div>
                  <span>CRANIUM SUBSTRATE™ CORE</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-mono text-[10px] border border-indigo-400/40">
                  TOTAL LATENCY: &lt; 0.42ms
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-indigo-200/80 pt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" /> Intent Permanent Anchor
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" /> Multi-Turn Identity Lock
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" /> Sub-ms Contradiction Gate
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" /> Immutable Audit Receipts
                </div>
              </div>
            </div>

            {/* Downward Data Flow Indicator */}
            <div className="flex justify-center text-neutral-500 py-0.5">
              <ArrowDown size={12} />
            </div>

            {/* Bottom Layer: Raw Foundation Models */}
            <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/90 text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu size={15} className="text-neutral-500" />
                <span>Foundation Models (GPT-4o, Claude 3.5, Gemini 1.5, Llama 3.1)</span>
              </div>
              <span className="text-[10px] text-rose-400/80 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/30">
                PROBABILISTIC BACKEND
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Invariants Breakdown */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
            <span className="font-semibold text-neutral-300">4 Substrate Sub-Engines</span>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
              <CheckCircle2 size={12} /> DETERMINISTIC GUARANTEE
            </span>
          </div>

          <div className="space-y-2.5">
            {engines.map((eng, idx) => {
              const Icon = eng.icon;
              const isActive = idx === activeEngineIndex;
              return (
                <div
                  key={eng.name}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? eng.activeColor + ' shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]'
                      : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-400 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-neutral-500'} />
                      <span className="font-semibold text-neutral-200 text-xs">{eng.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-indigo-300">
                      {eng.stat}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug pl-5.5">{eng.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Subtitle / Narration */}
      <div className="relative z-10 bg-neutral-900/95 border border-neutral-800 rounded-xl px-5 py-3 text-center backdrop-blur shadow-lg">
        <p className="text-xs sm:text-sm font-sans text-neutral-300 font-light">
          <span className="text-indigo-400 font-mono font-medium">[ACT II NARRATION]</span> "Introducing Cranium Substrate. A deterministic cognitive governance layer sitting above foundation models and below enterprise applications..."
        </p>
      </div>
    </div>
  );
}
