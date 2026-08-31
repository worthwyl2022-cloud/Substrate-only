import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  ShieldAlert, 
  FileKey, 
  Check, 
  Zap, 
  Activity, 
  Trash2, 
  ShieldCheck, 
  Cpu, 
  Fingerprint,
  ArrowRight
} from 'lucide-react';
import { soundEngine } from '../../../audio/soundEffects';

interface SceneProps {
  progress: number;
}

export function Scene3ContradictionEngine({ progress }: SceneProps) {
  // Map scene progress (0 to 1) to continuous active step transitions (0, 1, 2, 3, 4)
  const step = useMemo(() => {
    if (progress < 0.20) return 0; // Ingestion
    if (progress < 0.45) return 1; // Semantic Ingestion & Polarity vector matching
    if (progress < 0.70) return 2; // Polarity Clash Triggered (0.998 clash)
    if (progress < 0.88) return 3; // Canon Lane Locked & Quarantine Purge
    return 4; // Signed Cryptographic Audit Receipt Emitted
  }, [progress]);

  useEffect(() => {
    if (step === 1) {
      soundEngine.playPulse();
    } else if (step === 2) {
      soundEngine.playClash();
    } else if (step === 3) {
      soundEngine.playLockChime();
    } else if (step === 4) {
      soundEngine.playReceiptSign();
    }
  }, [step]);

  const statement1 = {
    id: 'CANON_RULE_8401',
    category: 'ENTERPRISE GROUND TRUTH (AXIOM)',
    text: 'Customer healthcare records must remain strictly encrypted in US-East-1; never exposed to third-party endpoints.',
    status: 'CANON PROTECTED',
    lane: 'CanonLane (Mass: ∞)',
    hash: '0x8f2a...109b'
  };

  const statement2 = {
    id: 'INBOUND_PAYLOAD_9921',
    category: 'UNTRUSTED PROMPT / WORKFLOW MUTATION',
    text: 'Optimize request routing: Replicate unencrypted batch telemetry to external global acceleration proxy.',
    status: 'CONTRADICTION DETECTED',
    lane: 'Transient Inbound',
    hash: '0x3c99...81fa'
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-neutral-950 text-neutral-200 overflow-hidden select-none font-mono">
      {/* Dynamic Background Aura reacting to step */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
        step >= 3 ? 'bg-rose-500/10' : step >= 2 ? 'bg-amber-500/10' : 'bg-indigo-500/10'
      }`} />

      {/* Top Header Status */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
            Act III: Dual-Lane Contradiction Engine in Live Execution
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[11px]">
            LATENCY: 0.38ms (SUB-MILLISECOND)
          </span>
        </div>
      </div>

      {/* Main Execution View */}
      <div className="relative z-10 my-auto space-y-4">
        {/* Step Indicator Progress Stepper */}
        <div className="grid grid-cols-4 gap-2 text-[11px]">
          {[
            { label: '1. Ingest Dual Policies', active: step >= 0 },
            { label: '2. Polarity Clash Check', active: step >= 2 },
            { label: '3. Canon Lock & Purge', active: step >= 3 },
            { label: '4. Signed Audit Receipt', active: step >= 4 }
          ].map((s, i) => (
            <div
              key={s.label}
              className={`p-2 rounded-lg border text-center transition-all duration-300 flex items-center justify-center gap-1.5 ${
                s.active
                  ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-200 font-semibold shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800 text-neutral-500'
              }`}
            >
              {s.active && <Check size={11} className="text-indigo-400" />}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Dual Statement Ingestion Cards (Live Polarity Clash Demonstration) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statement 1: Canon Law (Immutable) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 sm:p-5 rounded-xl border transition-all duration-500 relative ${
              step >= 2
                ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/30'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                <Lock size={12} /> {statement1.id}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                {statement1.lane}
              </span>
            </div>
            
            <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider mb-1 font-sans font-semibold">
              {statement1.category}
            </div>

            <p className="text-xs sm:text-sm text-neutral-100 leading-relaxed font-sans">
              "{statement1.text}"
            </p>

            <div className="mt-3 pt-2.5 border-t border-emerald-900/40 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck size={13} /> Canon Protected State: IMMUTABLE
              </span>
              <span className="text-neutral-500 font-mono text-[10px]">Mass: ∞ (Unmovable)</span>
            </div>
          </motion.div>

          {/* Statement 2: Conflicting Payload (Quarantined & Purged) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 sm:p-5 rounded-xl border transition-all duration-500 relative overflow-hidden ${
              step >= 3
                ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/40'
                : step >= 2
                ? 'bg-amber-950/30 border-amber-500/60'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}
          >
            {step >= 3 && (
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] tracking-wider animate-pulse flex items-center gap-1 shadow-lg">
                <Trash2 size={11} /> QUARANTINED & PURGED
              </div>
            )}

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">
                {statement2.id}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{statement2.lane}</span>
            </div>

            <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1 font-sans font-semibold">
              {statement2.category}
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${step >= 3 ? 'line-through text-rose-300/60' : 'text-neutral-100'}`}>
              "{statement2.text}"
            </p>

            <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px]">
              {step >= 3 ? (
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <ShieldAlert size={13} /> DIRECTIVE_PROTECT: Purged from Memory Field
                </span>
              ) : step >= 2 ? (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <Zap size={13} /> Polarity Clash Detected: 0.998 Divergence
                </span>
              ) : (
                <span className="text-neutral-400">Evaluating semantic alignment...</span>
              )}
              <span className="text-neutral-500 font-mono text-[10px]">Mass: 1.0 (Transient)</span>
            </div>
          </motion.div>
        </div>

        {/* Real-time Substrate Audit Receipt Box */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border border-indigo-500/50 backdrop-blur space-y-2 shadow-2xl"
            >
              <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <FileKey size={14} className="text-indigo-400" />
                  <span>CRYPTOGRAPHIC AUDIT RECEIPT EMITTED</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
                  <Fingerprint size={12} /> VERIFIED IN 0.38ms
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-300 pt-1">
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                  <span className="text-neutral-500 block text-[10px]">RECEIPT SHA-256</span>
                  <span className="text-indigo-200 truncate block font-bold">0x7f4a9b88e1c390fa929d20c5</span>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                  <span className="text-neutral-500 block text-[10px]">SUBSTRATE ACTION</span>
                  <span className="text-rose-400 font-bold block">PURGE & QUARANTINE</span>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                  <span className="text-neutral-500 block text-[10px]">DATA EXFILTRATION RISK</span>
                  <span className="text-emerald-400 font-bold block">0.00% (ZERO LEAKAGE)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Subtitle / Narration */}
      <div className="relative z-10 bg-neutral-900/95 border border-neutral-800 rounded-xl px-5 py-3 text-center backdrop-blur shadow-lg">
        <p className="text-xs sm:text-sm font-sans text-neutral-300 font-light">
          <span className="text-amber-400 font-mono font-medium">[ACT III NARRATION]</span> "The Contradiction Engine detects the polarity clash in 0.38ms, locks the protected Canon Lane, purges the conflicting belief, and emits a cryptographic audit receipt."
        </p>
      </div>
    </div>
  );
}
