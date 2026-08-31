import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, RotateCcw, FileText, CheckCircle2, Sparkles } from 'lucide-react';

interface SceneProps {
  progress: number;
  onReplay?: () => void;
  onClose?: () => void;
}

export function Scene5EndCard({ progress, onReplay, onClose }: SceneProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 bg-neutral-950 text-neutral-200 overflow-hidden select-none font-mono">
      {/* Cinematic Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top watermark */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800/60 pb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span>CRANIUM CORE · ACQUISITION GRADE ASSET</span>
        </div>
        <div className="text-[11px] text-neutral-500">
          TECHNICAL DUE DILIGENCE READY
        </div>
      </div>

      {/* Main Hero Card Typography */}
      <div className="relative z-10 my-auto text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          {/* Logo icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 mx-auto shadow-[0_0_35px_rgba(99,102,241,0.35)]">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Sparkles size={30} />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white font-sans">
            Cranium <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-200">Substrate™</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 font-light font-sans tracking-wide">
            Epistemic Governance for AI Systems
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
            <CheckCircle2 size={13} className="text-indigo-400" />
            <span>Built by Wyl Mathes. © 2026. All Rights Reserved.</span>
          </div>
        </motion.div>

        {/* Quick Action Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans text-xs sm:text-sm"
        >
          {onReplay && (
            <button
              onClick={onReplay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Replay Demo (2:30)</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 font-medium transition-all cursor-pointer"
            >
              <FileText size={16} className="text-neutral-400" />
              <span>Explore Live Workspace</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Footer Disclaimer */}
      <div className="relative z-10 text-center text-[11px] text-neutral-500 font-mono">
        CANON LANE · CONTRADICTION ENGINE · CRANIUM IMMUNE LAYER · AUDIT RECEIPT PIPELINE
      </div>
    </div>
  );
}
