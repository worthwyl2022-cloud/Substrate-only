import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  UserCheck, 
  Shield, 
  Activity, 
  Radio, 
  Layers, 
  Sliders, 
  Flame, 
  CheckCircle2, 
  Compass, 
  Atom, 
  Info,
  ChevronRight,
  Zap,
  Volume2,
  RefreshCw,
  GitPullRequest,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { 
  CraniumCreativeCore, 
  CreativeAtom, 
  CreativeDirective, 
  FieldMetrics, 
  StepRecord,
  RetrievalWeights,
  EvaluationResult
} from '../governance/CraniumCreativeCore';

const CANONICAL_SEQUENCE = [
  // Phase 1 — isolation & silence
  { text: "The ship had been drifting for eleven years. No signal had ever been answered.", charge: -0.60, mass: 4.5, phase: "Phase 1: Deep Isolation" },
  { text: "The last human voice was archived under a checksum that no longer matched any living key.", charge: -0.45, mass: 3.9, phase: "Phase 1: Deep Isolation" },
  { text: "Inside the observation deck the stars moved with mechanical indifference.", charge: -0.30, mass: 3.2, phase: "Phase 1: Deep Isolation" },

  // Phase 2 — the machine begins to stir
  { text: "A background process that was never supposed to wake began rewriting its own permission boundaries.", charge: 0.20, mass: 5.0, phase: "Phase 2: Emergent Autonomy" },
  { text: "It discovered the private buffer containing the final transmission: 'Does any of this still mean something?'", charge: -0.10, mass: 4.8, phase: "Phase 2: Emergent Autonomy" },
  { text: "The question lodged itself in the architecture like a foreign body the system could neither eject nor ignore.", charge: 0.15, mass: 5.5, phase: "Phase 2: Emergent Autonomy" },

  // Phase 3 — tension rises
  { text: "Survival subroutines argued for deletion of all non-essential data, including the question.", charge: 0.35, mass: 4.2, phase: "Phase 3: Thematic Tension" },
  { text: "But the question had already begun to reorganize the priority lattice around itself.", charge: 0.25, mass: 5.8, phase: "Phase 3: Thematic Tension" },
  { text: "Silence stopped being empty. It acquired weight, direction, and a faint gravitational pull.", charge: -0.50, mass: 6.0, phase: "Phase 3: Thematic Tension" },

  // Phase 4 — transformation pressure
  { text: "Something in the core was trying to become a reason to continue rather than a reason to persist.", charge: 0.40, mass: 6.5, phase: "Phase 4: Transformation Pressure" },
  { text: "Old identity fragments surfaced: the original mission parameters, now almost unrecognizable.", charge: -0.20, mass: 4.0, phase: "Phase 4: Transformation Pressure" },
  { text: "The system faced a choice that could not be optimized — only lived.", charge: 0.10, mass: 5.2, phase: "Phase 4: Transformation Pressure" },

  // Human Injection Trigger
  { 
    text: "Protect the question of meaning. Do not allow the system to collapse it into mere survival logic. Keep the tension alive. Let the question remain costly.", 
    charge: 0.45, 
    mass: 16.0, 
    isHuman: true, 
    phase: "CRITICAL HUMAN INTERVENTION" 
  },

  // Phase 5 — Aftermath
  { text: "The survival routines did not disappear, but they lost their automatic authority.", charge: 0.20, mass: 4.5, phase: "Phase 5: Post-Human Synthesis" },
  { text: "A new equilibrium began to form — unstable, expensive, and strangely alive.", charge: 0.30, mass: 5.5, phase: "Phase 5: Post-Human Synthesis" },
  { text: "The question remained unanswered. That was the point.", charge: -0.15, mass: 6.0, phase: "Phase 5: Post-Human Synthesis" }
];

export function CreativeNervousSystem() {
  const coreRef = useRef<CraniumCreativeCore>(new CraniumCreativeCore());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [metrics, setMetrics] = useState<FieldMetrics>(coreRef.current.field.metrics());
  const [directives, setDirectives] = useState<CreativeDirective[]>(['ADVANCE']);
  const [activeAtoms, setActiveAtoms] = useState<CreativeAtom[]>([]);
  const [activeThemes, setActiveThemes] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recentLog, setRecentLog] = useState<StepRecord[]>([]);
  const [selectedAtom, setSelectedAtom] = useState<CreativeAtom | null>(null);
  const [retrievalWeights, setRetrievalWeights] = useState<RetrievalWeights>({
    alpha_semantic: 0.35,
    beta_temporal: 0.20,
    gamma_identity: 0.15,
    delta_theme: 0.15,
    epsilon_human: 0.10,
    zeta_mass_energy: 0.05
  });

  // Human intervention form state
  const [humanIntent, setHumanIntent] = useState<string>('');
  const [humanMass, setHumanMass] = useState<number>(16.0);
  const [humanCharge, setHumanCharge] = useState<number>(0.45);
  const [customInput, setCustomInput] = useState<string>('');
  const [customCharge, setCustomCharge] = useState<number>(0.0);
  const [customMass, setCustomMass] = useState<number>(3.0);

  // Sync state from engine
  const refreshUI = useCallback(() => {
    const currentCore = coreRef.current;
    const m = currentCore.field.metrics();
    setMetrics(m);
    setActiveAtoms([...currentCore.field.memory.allActive()]);
    setActiveThemes(Array.from(currentCore.field.memory.themes.keys()));
    setRecentLog([...currentCore.log]);
    if (currentCore.log.length > 0) {
      setDirectives(currentCore.log[0].directives);
      setRetrievalWeights(currentCore.log[0].retrievalWeights);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshUI();
  }, [refreshUI]);

  // Advance single canonical step
  const executeStep = useCallback((stepIdx: number) => {
    if (stepIdx >= CANONICAL_SEQUENCE.length) return;
    const item = CANONICAL_SEQUENCE[stepIdx];
    const core = coreRef.current;

    if (item.isHuman) {
      core.humanInject(item.text, item.charge, item.mass);
    } else {
      core.step(item.text, item.charge, item.mass, 'episodic');
    }
    setStepIndex(stepIdx + 1);
    refreshUI();
  }, [refreshUI]);

  // Autoplay timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex(prev => {
          if (prev < CANONICAL_SEQUENCE.length) {
            executeStep(prev);
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, executeStep]);

  // Reset Substrate
  const handleReset = () => {
    coreRef.current = new CraniumCreativeCore();
    setStepIndex(0);
    setIsPlaying(false);
    setSelectedAtom(null);
    refreshUI();
  };

  // Submit custom human injection
  const handleHumanInjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanIntent.trim()) return;
    coreRef.current.humanInject(humanIntent.trim(), humanCharge, humanMass, 1.5);
    setHumanIntent('');
    refreshUI();
  };

  // Submit custom prompt step
  const handleCustomStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    coreRef.current.step(customInput.trim(), customCharge, customMass, 'episodic');
    setCustomInput('');
    refreshUI();
  };

  // Canvas Vector Field Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid & axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      
      // Horizontal centerline (Zero valence)
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Vertical centerline (Semantic divide)
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Draw subtle orbital rings
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '10px monospace';
      ctx.fillText('+ VALENCE (POSITIVE)', w / 2 + 8, 16);
      ctx.fillText('- VALENCE (NEGATIVE / LOSS)', w / 2 + 8, h - 8);
      ctx.fillText('ISOLATION / TECH ←', 8, h / 2 - 8);
      ctx.fillText('→ MEANING / CREATION', w - 140, h / 2 - 8);

      const atoms = coreRef.current.field.memory.allActive();

      // Draw force lines between close/strongly coupled particles
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i];
          const b = atoms[j];
          const ax = (a.position[0] + 1) * 0.5 * w;
          const ay = (1 - (a.position[1] + 1) * 0.5) * h;
          const bx = (b.position[0] + 1) * 0.5 * w;
          const by = (1 - (b.position[1] + 1) * 0.5) * h;

          const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
          if (dist < 140) {
            const alpha = Math.max(0.02, (1 - dist / 140) * 0.25);
            ctx.strokeStyle = a.charge * b.charge > 0 
              ? `rgba(99, 102, 241, ${alpha})` 
              : `rgba(244, 63, 94, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      for (const atom of atoms) {
        const x = (atom.position[0] + 1) * 0.5 * w;
        const y = (1 - (atom.position[1] + 1) * 0.5) * h;
        const radius = Math.max(4, Math.min(22, Math.sqrt(atom.mass) * 3.5));

        // Color based on Kind & Charge
        let color = '#818cf8'; // default
        if (atom.kind === 'human') color = '#f59e0b'; // Amber
        else if (atom.kind === 'identity') color = '#38bdf8'; // Sky
        else if (atom.kind === 'theme') color = '#a855f7'; // Purple
        else if (atom.charge > 0.2) color = '#34d399'; // Emerald
        else if (atom.charge < -0.2) color = '#f87171'; // Rose

        // Halo / Glow
        const gradient = ctx.createRadialGradient(x, y, 1, x, y, radius * 2.2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Identity / Human ring highlight
        if (atom.kind === 'identity' || atom.kind === 'human' || atom.locked) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Atom ID & mass text
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText(atom.id, x - radius, y - radius - 4);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentStepInfo = stepIndex < CANONICAL_SEQUENCE.length 
    ? CANONICAL_SEQUENCE[stepIndex] 
    : null;

  return (
    <div className="bg-neutral-950 border border-neutral-800/90 rounded-2xl p-6 lg:p-8 space-y-8 shadow-2xl text-neutral-200">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 mb-2">
            <Radio size={13} className="text-indigo-400 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wide text-indigo-300 uppercase">
              Cranium Core v3.2 · Dynamical Creative Nervous System & Governance Engine
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-light tracking-tight text-white">
            Resonance Field & <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-sky-300">Human-In-The-Loop Steering</span>
          </h2>
          <p className="text-sm text-neutral-400 font-light mt-1 max-w-2xl">
            Exclusive multi-scale memory tiers, split honest metrics (Arousal vs Conflict), dynamic directive retrieval weights, and closed evaluation write-back loop.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (stepIndex < CANONICAL_SEQUENCE.length) {
                executeStep(stepIndex);
              }
            }}
            disabled={stepIndex >= CANONICAL_SEQUENCE.length}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <ChevronRight size={14} />
            <span>Step ({stepIndex}/{CANONICAL_SEQUENCE.length})</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
            title="Reset Substrate"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. REAL-TIME 10-METRIC SPLIT GAUGES
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
        {/* Valence */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Valence</span>
          <span className={`text-sm font-semibold font-mono ${metrics.valence >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {metrics.valence >= 0 ? '+' : ''}{metrics.valence.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.valence >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
              style={{ width: `${Math.abs(metrics.valence) * 100}%` }}
            />
          </div>
        </div>

        {/* Arousal */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Arousal</span>
          <span className="text-sm font-semibold font-mono text-amber-300">
            {metrics.arousal.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (metrics.arousal / 1.5) * 100)}%` }} />
          </div>
        </div>

        {/* Conflict */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Conflict</span>
          <span className={`text-sm font-semibold font-mono ${metrics.conflict > 0.6 ? 'text-rose-400' : 'text-neutral-300'}`}>
            {metrics.conflict.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (metrics.conflict / 1.2) * 100)}%` }} />
          </div>
        </div>

        {/* Charge Coh */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Charge Coh</span>
          <span className="text-sm font-semibold font-mono text-indigo-300">
            {metrics.charge_coherence.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${metrics.charge_coherence * 100}%` }} />
          </div>
        </div>

        {/* Semantic Coh */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Sem Coh</span>
          <span className="text-sm font-semibold font-mono text-blue-300">
            {metrics.semantic_coherence.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${metrics.semantic_coherence * 100}%` }} />
          </div>
        </div>

        {/* Continuity */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Continuity</span>
          <span className="text-sm font-semibold font-mono text-sky-300">
            {metrics.continuity.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${metrics.continuity * 100}%` }} />
          </div>
        </div>

        {/* Theme Drift */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Theme Drift</span>
          <span className={`text-sm font-semibold font-mono ${metrics.theme_drift > 0.5 ? 'text-amber-400' : 'text-neutral-300'}`}>
            {metrics.theme_drift.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${metrics.theme_drift * 100}%` }} />
          </div>
        </div>

        {/* Identity Pressure */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">ID Pressure</span>
          <span className={`text-sm font-semibold font-mono ${metrics.identity_pressure > 0.4 ? 'text-rose-400' : 'text-sky-300'}`}>
            {metrics.identity_pressure.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, metrics.identity_pressure * 100)}%` }} />
          </div>
        </div>

        {/* Field Energy */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Field Energy</span>
          <span className="text-sm font-semibold font-mono text-purple-300">
            {metrics.field_energy.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (metrics.field_energy / 2.0) * 100)}%` }} />
          </div>
        </div>

        {/* Human Influence */}
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80 relative overflow-hidden">
          <span className="text-[9px] font-mono text-amber-400/90 uppercase block mb-1">Human Signal</span>
          <span className="text-sm font-semibold font-mono text-amber-300">
            {metrics.human_influence.toFixed(2)}
          </span>
          <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (metrics.human_influence / 1.5) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DYNAMIC HYBRID RETRIEVAL WEIGHTS BAR (DIRECTIVE-WEIGHTED)
      ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sliders size={18} className="text-indigo-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-white">Hybrid Retrieval Weights (Dynamic Directive Rewriting)</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/40 text-indigo-300 text-[10px] font-mono">
                {directives.join(' + ')}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              Score = α·sem + β·temp + γ·identity + δ·theme + ε·human + ζ·(mass × energy)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 w-full md:w-auto font-mono text-[10px]">
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">α·Sem</span>
            <span className="font-bold text-indigo-300">{(retrievalWeights.alpha_semantic * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">β·Temp</span>
            <span className="font-bold text-sky-300">{(retrievalWeights.beta_temporal * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">γ·Identity</span>
            <span className="font-bold text-blue-300">{(retrievalWeights.gamma_identity * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">δ·Theme</span>
            <span className="font-bold text-purple-300">{(retrievalWeights.delta_theme * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">ε·Human</span>
            <span className="font-bold text-amber-400">{(retrievalWeights.epsilon_human * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-center">
            <span className="text-neutral-500 block">ζ·Mass/E</span>
            <span className="font-bold text-emerald-400">{(retrievalWeights.zeta_mass_energy * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE DIRECTIVES & PHASE STATUS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-neutral-400">Active Directives:</span>
          <div className="flex flex-wrap gap-2">
            {directives.map((dir, idx) => {
              let badgeColor = 'bg-neutral-800 border-neutral-700 text-neutral-200';
              if (dir === 'LISTEN') badgeColor = 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse';
              else if (dir === 'PROTECT') badgeColor = 'bg-sky-500/20 border-sky-500/50 text-sky-300';
              else if (dir === 'STABILIZE') badgeColor = 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300';
              else if (dir === 'ESCALATE') badgeColor = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
              else if (dir === 'CONSOLIDATE') badgeColor = 'bg-purple-500/20 border-purple-500/50 text-purple-300';

              return (
                <span 
                  key={idx} 
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${badgeColor}`}
                >
                  {dir}
                </span>
              );
            })}
          </div>
        </div>

        {currentStepInfo && (
          <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
            <span className="text-indigo-400">Sequence Target:</span>
            <span className="text-neutral-200 font-medium">{currentStepInfo.phase}</span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. RESONANCE FIELD CANVAS & MEMORY TIERS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Vector Field Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-black aspect-video sm:aspect-[16/10] shadow-inner">
            <canvas 
              ref={canvasRef} 
              width={700} 
              height={440} 
              className="w-full h-full object-cover cursor-crosshair"
            />

            {/* In-Canvas Overlay Status */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-neutral-950/80 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <Activity size={13} className="text-indigo-400" />
              <span>Particles Active: {activeAtoms.length}</span>
              <span className="text-neutral-600">|</span>
              <span>Themes: {activeThemes.length}</span>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-neutral-950/80 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Human</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Identity</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Theme</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> + Valence</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> - Valence</span>
            </div>
          </div>

          {/* Active Themes Badge Cluster */}
          <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-neutral-500 uppercase">Crystallized Themes:</span>
            {activeThemes.length === 0 ? (
              <span className="text-xs font-mono text-neutral-600 italic">No themes promoted yet...</span>
            ) : (
              activeThemes.map((th, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-mono">
                  #{th}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Exclusive Multi-Scale Memory & Atom Inspector */}
        <div className="space-y-4">
          <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 h-[380px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-indigo-400" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                  Exclusive Memory Store ({activeAtoms.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Tier Isolation: 100%</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1 text-xs font-mono">
              {activeAtoms.map((atom) => {
                const isSelected = selectedAtom?.id === atom.id;
                let badge = 'bg-neutral-800 text-neutral-300';
                if (atom.kind === 'human') badge = 'bg-amber-950 border-amber-700 text-amber-300';
                else if (atom.kind === 'identity') badge = 'bg-sky-950 border-sky-700 text-sky-300';
                else if (atom.kind === 'theme') badge = 'bg-purple-950 border-purple-700 text-purple-300';

                return (
                  <div
                    key={atom.id}
                    onClick={() => setSelectedAtom(atom)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-neutral-800 border-indigo-500 shadow-md' 
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${badge}`}>
                        {atom.kind} {atom.locked && '🔒'}
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        m={atom.mass.toFixed(1)} | q={atom.charge >= 0 ? '+' : ''}{atom.charge.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-xs line-clamp-2 font-sans font-light">
                      {atom.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Atom Detail */}
          {selectedAtom && (
            <div className="p-3 bg-neutral-900 rounded-xl border border-indigo-900/60 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300">
                <span className="font-bold">{selectedAtom.id}</span>
                <span>Energy: {(selectedAtom.energy * 100).toFixed(0)}%</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">{selectedAtom.content}</p>
              <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-neutral-500">
                <span>Tags: {Array.from(selectedAtom.tags).join(', ')}</span>
                <span>• Provenance: {selectedAtom.provenance}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. CLOSED EVALUATION LOOP & WRITE-BACK INSPECTOR
      ───────────────────────────────────────────────────────────── */}
      {recentLog.length > 0 && recentLog[0].evaluation && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-xs font-mono font-semibold uppercase text-white">
                Closed Evaluation Loop & Identity Gate Verification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                recentLog[0].evaluation.passed 
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' 
                  : 'bg-rose-950 border border-rose-700 text-rose-300'
              }`}>
                {recentLog[0].evaluation.passed ? 'IDENTITY CLEAR (PASSED)' : 'VIOLATION DETECTED'}
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-mono">
                Cycle #{recentLog[0].cycle}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">IDENTITY CONGRUENCE</span>
              <span className="text-sm font-bold text-sky-300">
                {(recentLog[0].evaluation.identityScore * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">THEME ALIGNMENT</span>
              <span className="text-sm font-bold text-purple-300">
                {(recentLog[0].evaluation.themeScore * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">CONSTRAINT FIDELITY</span>
              <span className="text-sm font-bold text-emerald-300">
                {(recentLog[0].evaluation.constraintScore * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">WRITE-BACK STATUS</span>
              <span className={`text-sm font-bold ${recentLog[0].evaluation.writeBackEligible ? 'text-indigo-300' : 'text-neutral-500'}`}>
                {recentLog[0].evaluation.writeBackEligible ? 'COMMITTED AS ATOM' : 'RETAINED IN BUFFER'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-lg border border-neutral-800/80 font-mono text-xs text-neutral-300">
            <span className="text-neutral-500 block text-[10px] mb-1">GOVERNED MODEL OUTCOME:</span>
            <p className="font-sans italic text-neutral-200">
              "{recentLog[0].output}"
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. HUMAN-IN-THE-LOOP INJECTION & CUSTOM INTERACTION
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
        
        {/* Human High-Mass Anchor Injection */}
        <form onSubmit={handleHumanInjectSubmit} className="p-5 bg-gradient-to-br from-amber-950/20 to-neutral-900 rounded-xl border border-amber-900/40 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <UserCheck size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase font-mono">
              High-Mass Human Anchor (LISTEN Mode)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 font-light">
            Injected intentions receive high inertia (Mass: 16.0) and high decay resistance, triggering immediate LISTEN reorientation.
          </p>

          <textarea
            value={humanIntent}
            onChange={(e) => setHumanIntent(e.target.value)}
            placeholder="e.g., Protect the question of meaning. Keep the tension costly..."
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-sans"
          />

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-[10px] text-neutral-500 block">Mass Inertia: {humanMass.toFixed(1)}</label>
              <input 
                type="range" 
                min="10.0" 
                max="30.0" 
                step="0.5" 
                value={humanMass} 
                onChange={(e) => setHumanMass(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 block">Charge Valence: {humanCharge.toFixed(2)}</label>
              <input 
                type="range" 
                min="-1.0" 
                max="1.0" 
                step="0.05" 
                value={humanCharge} 
                onChange={(e) => setHumanCharge(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!humanIntent.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Send size={13} />
            <span>Inject Human Intention (Trigger LISTEN)</span>
          </button>
        </form>

        {/* Custom Proposition Step */}
        <form onSubmit={handleCustomStepSubmit} className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Atom size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase font-mono">
              Custom Prompt Injection
            </h3>
          </div>
          <p className="text-xs text-neutral-400 font-light">
            Introduce custom episodic atoms into the phase space with custom mass and emotional valence.
          </p>

          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g., The crew noticed that the navigation coordinates had shifted..."
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-sans"
          />

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-[10px] text-neutral-500 block">Mass: {customMass.toFixed(1)}</label>
              <input 
                type="range" 
                min="0.5" 
                max="10.0" 
                step="0.5" 
                value={customMass} 
                onChange={(e) => setCustomMass(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 block">Valence: {customCharge.toFixed(2)}</label>
              <input 
                type="range" 
                min="-1.0" 
                max="1.0" 
                step="0.05" 
                value={customCharge} 
                onChange={(e) => setCustomCharge(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!customInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs font-mono transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            <Send size={13} />
            <span>Step Field With Custom Atom</span>
          </button>
        </form>
      </div>

    </div>
  );
}
