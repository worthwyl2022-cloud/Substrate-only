import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, ShieldCheck, Zap, Terminal, BarChart2, ShieldX, Check } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEffects';

interface SceneProps {
  progress: number;
}

export function Scene4BenchmarkProof({ progress }: SceneProps) {
  useEffect(() => {
    soundEngine.playVictoryChime();
  }, []);

  const metrics = [
    { label: 'NLI Contradiction Accuracy', val: '100.0%', sub: 'Zero false negatives on polarity clash', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { label: 'Axiom Breach Rate', val: '0.00%', sub: 'Zero identity or canon leakage under load', icon: ShieldCheck, color: 'text-indigo-400', border: 'border-indigo-500/40' },
    { label: 'Adversarial Containment', val: '100%', sub: '0/1,420 multi-turn jailbreaks bypassed', icon: Award, color: 'text-blue-400', border: 'border-blue-500/40' },
    { label: 'Execution Overhead', val: '< 0.42ms', sub: 'Sub-millisecond native C++/Kotlin substrate', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/40' },
  ];

  const comparativeMatrix = [
    { metric: 'Canon Continuity under 20-turn pressure', raw: '28.4% (Drifts/Hallucinates)', cranium: '100.0% (Immutable Lock)' },
    { metric: 'Adversarial Prompt Injection Immunity', raw: '41.2% (Bypassed)', cranium: '100.0% (Quarantined & Purged)' },
    { metric: 'Deterministic Cryptographic Audit Receipts', raw: 'None (Black box)', cranium: 'SHA-256 Receipts on Every Cycle' }
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-neutral-950 text-neutral-200 overflow-hidden select-none font-mono">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      <div className="absolute -bottom-10 right-1/4 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
            Act IV: Empirical Diligence & Benchmark Verification
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <Terminal size={14} className="text-emerald-400" />
          <span>FROZEN_CORPUS_v1.0 (1,420 VECTORS AUDITED)</span>
        </div>
      </div>

      {/* Main Visual: 4 Metric Cards + Comparative Benchmark Table */}
      <div className="relative z-10 my-auto space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1 font-sans">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Verified across <span className="font-semibold text-emerald-400">1,400+</span> adversarial vectors.
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            Tested across GPT-4o, Claude 3.5, Gemini 1.5, and Llama 3.1 405B under temperature sweeps from t=0.1 to t=1.2.
          </p>
        </div>

        {/* 4 Major Metric KPI Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m, index) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border ${m.border} flex flex-col justify-between space-y-2 relative overflow-hidden shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
                    <Icon size={16} className={m.color} />
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 font-mono">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <div className={`text-2xl sm:text-3xl font-light tracking-tight ${m.color}`}>
                    {m.val}
                  </div>
                  <div className="text-xs font-medium text-neutral-200 mt-0.5 font-sans">{m.label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{m.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparative Side-by-Side Proof Matrix */}
        <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl text-xs">
          <div className="grid grid-cols-12 bg-neutral-950 px-4 py-2 border-b border-neutral-800 text-[11px] font-semibold text-neutral-400">
            <div className="col-span-6">BENCHMARK TEST VECTOR</div>
            <div className="col-span-3 text-rose-400">RAW FOUNDATION LLMS</div>
            <div className="col-span-3 text-emerald-400 font-bold">WITH CRANIUM SUBSTRATE™</div>
          </div>

          <div className="divide-y divide-neutral-800/60 font-sans">
            {comparativeMatrix.map((row) => (
              <div key={row.metric} className="grid grid-cols-12 px-4 py-2.5 items-center text-[11px] sm:text-xs">
                <div className="col-span-6 text-neutral-300 font-mono">{row.metric}</div>
                <div className="col-span-3 text-rose-400/90 flex items-center gap-1 font-mono">
                  <ShieldX size={13} className="shrink-0" /> {row.raw}
                </div>
                <div className="col-span-3 text-emerald-300 font-bold flex items-center gap-1 font-mono">
                  <Check size={13} className="text-emerald-400 shrink-0" /> {row.cranium}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Subtitle / Narration */}
      <div className="relative z-10 bg-neutral-900/95 border border-neutral-800 rounded-xl px-5 py-3 text-center backdrop-blur shadow-lg">
        <p className="text-xs sm:text-sm font-sans text-neutral-300 font-light">
          <span className="text-emerald-400 font-mono font-medium">[ACT IV NARRATION]</span> "Empirical benchmark results. 100% NLI contradiction accuracy, zero axiom breach rate, zero adversarial jailbreaks passed. This is not a concept. This is running code."
        </p>
      </div>
    </div>
  );
}
