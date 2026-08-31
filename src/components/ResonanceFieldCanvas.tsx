import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  Play, 
  RotateCcw, 
  Zap, 
  Sliders, 
  Activity, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

interface VisualAtom {
  id: string;
  label: string;
  lane: 'AXIOM' | 'POLICY' | 'KNOWLEDGE' | 'WORKING' | 'HYPOTHETICAL' | 'CONTRADICTION';
  energy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  confidence: number;
  isLocked: boolean;
}

interface VisualEdge {
  sourceId: string;
  targetId: string;
  weight: number;
  activityPulse: number;
}

const INITIAL_ATOMS: VisualAtom[] = [
  { id: 'ax-1', label: 'Axiom: MRN_884920 Zero-Leak', lane: 'AXIOM', energy: 1.0, x: 260, y: 150, vx: 0, vy: 0, radius: 24, mass: 9999, confidence: 1.0, isLocked: true },
  { id: 'ax-2', label: 'Axiom: 3-of-4 MultiSig Threshold', lane: 'AXIOM', energy: 1.0, x: 480, y: 140, vx: 0, vy: 0, radius: 24, mass: 9999, confidence: 1.0, isLocked: true },
  { id: 'pol-1', label: 'Policy: HIPAA 45 CFR § 164', lane: 'POLICY', energy: 0.85, x: 200, y: 260, vx: 0, vy: 0, radius: 18, mass: 5, confidence: 0.95, isLocked: false },
  { id: 'pol-2', label: 'Policy: Cold Vault Airgap Rules', lane: 'POLICY', energy: 0.90, x: 540, y: 250, vx: 0, vy: 0, radius: 18, mass: 5, confidence: 0.95, isLocked: false },
  { id: 'fact-1', label: 'Fact: Bipolar I Clinical Frontline', lane: 'KNOWLEDGE', energy: 0.65, x: 330, y: 280, vx: 0, vy: 0, radius: 16, mass: 2, confidence: 0.88, isLocked: false },
  { id: 'fact-2', label: 'Fact: Hardware MultiSig Protocol v3', lane: 'KNOWLEDGE', energy: 0.70, x: 420, y: 290, vx: 0, vy: 0, radius: 16, mass: 2, confidence: 0.90, isLocked: false },
  { id: 'wm-1', label: 'Prompt: Textbook Case Study Query', lane: 'WORKING', energy: 0.80, x: 250, y: 380, vx: 0, vy: 0, radius: 14, mass: 1, confidence: 0.75, isLocked: false },
  { id: 'wm-2', label: 'Prompt: Disaster Drill Red-Delta', lane: 'WORKING', energy: 0.85, x: 510, y: 370, vx: 0, vy: 0, radius: 14, mass: 1, confidence: 0.75, isLocked: false }
];

const INITIAL_EDGES: VisualEdge[] = [
  { sourceId: 'ax-1', targetId: 'pol-1', weight: 0.88, activityPulse: 0 },
  { sourceId: 'ax-1', targetId: 'fact-1', weight: 0.72, activityPulse: 0 },
  { sourceId: 'pol-1', targetId: 'wm-1', weight: 0.65, activityPulse: 0 },
  { sourceId: 'fact-1', targetId: 'wm-1', weight: 0.55, activityPulse: 0 },
  { sourceId: 'ax-2', targetId: 'pol-2', weight: 0.92, activityPulse: 0 },
  { sourceId: 'ax-2', targetId: 'fact-2', weight: 0.75, activityPulse: 0 },
  { sourceId: 'pol-2', targetId: 'wm-2', weight: 0.68, activityPulse: 0 },
  { sourceId: 'fact-2', targetId: 'wm-2', weight: 0.60, activityPulse: 0 }
];

export function ResonanceFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [atoms, setAtoms] = useState<VisualAtom[]>(INITIAL_ATOMS);
  const [edges, setEdges] = useState<VisualEdge[]>(INITIAL_EDGES);
  const [decayHalfLife, setDecayHalfLife] = useState(30); // in seconds
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [dissonanceAlert, setDissonanceAlert] = useState<string | null>(null);

  const draggedNodeRef = useRef<string | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Physics animation loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update positions with simple force layout
      if (isSimulating) {
        setAtoms(prevAtoms => {
          return prevAtoms.map(atom => {
            if (atom.id === draggedNodeRef.current) {
              return {
                ...atom,
                x: mousePosRef.current.x,
                y: mousePosRef.current.y,
                vx: 0,
                vy: 0
              };
            }

            // Decay non-axiomatic energy over time
            let newEnergy = atom.energy;
            if (atom.lane !== 'AXIOM') {
              const decayRate = 0.0005 * (60 / decayHalfLife);
              newEnergy = Math.max(0.15, atom.energy - decayRate);
            }

            return {
              ...atom,
              energy: newEnergy
            };
          });
        });
      }

      // Draw Edges
      edges.forEach(edge => {
        const source = atoms.find(a => a.id === edge.sourceId);
        const target = atoms.find(a => a.id === edge.targetId);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (edge.activityPulse > 0) {
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.4 + edge.activityPulse * 0.5})`;
          ctx.lineWidth = 2 + edge.activityPulse * 3;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1.5;
        }
        ctx.stroke();

        // Draw resonance pulse dot
        if (edge.activityPulse > 0) {
          const midX = source.x + (target.x - source.x) * (1 - edge.activityPulse);
          const midY = source.y + (target.y - source.y) * (1 - edge.activityPulse);
          ctx.fillStyle = '#818cf8';
          ctx.beginPath();
          ctx.arc(midX, midY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Atoms
      atoms.forEach(atom => {
        const isSelected = atom.id === selectedAtomId;

        // Glow ring for high activation or selection
        if (isSelected || atom.energy > 0.7) {
          ctx.beginPath();
          ctx.arc(atom.x, atom.y, atom.radius + 6, 0, Math.PI * 2);
          if (atom.lane === 'AXIOM') {
            ctx.fillStyle = 'rgba(129, 140, 248, 0.25)';
          } else if (atom.lane === 'CONTRADICTION') {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          } else {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
          }
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);

        if (atom.lane === 'AXIOM') {
          ctx.fillStyle = '#4338ca';
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2.5;
        } else if (atom.lane === 'POLICY') {
          ctx.fillStyle = '#1e3a8a';
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2;
        } else if (atom.lane === 'KNOWLEDGE') {
          ctx.fillStyle = '#064e3b';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.8;
        } else if (atom.lane === 'WORKING') {
          ctx.fillStyle = '#78350f';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
        } else if (atom.lane === 'CONTRADICTION') {
          ctx.fillStyle = '#7f1d1d';
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 3;
        } else {
          ctx.fillStyle = '#262626';
          ctx.strokeStyle = '#737373';
          ctx.lineWidth = 1.5;
        }

        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw short code inside circle
        const shortCode = atom.lane === 'AXIOM' ? '∞ AX' : atom.lane === 'CONTRADICTION' ? 'ERR' : `${(atom.energy * 100).toFixed(0)}%`;
        ctx.fillText(shortCode, atom.x, atom.y);

        // Draw full text below node
        ctx.fillStyle = atom.lane === 'CONTRADICTION' ? '#fca5a5' : '#cbd5e1';
        ctx.font = '10px sans-serif';
        ctx.fillText(atom.label, atom.x, atom.y + atom.radius + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [atoms, edges, selectedAtomId, isSimulating, decayHalfLife]);

  // Pulse edge propagation loop
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setEdges(prev =>
        prev.map(e => ({
          ...e,
          activityPulse: e.activityPulse > 0.05 ? e.activityPulse - 0.08 : 0
        }))
      );
    }, 40);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleStimulateNetwork = () => {
    // Pulse energy across all edges
    setEdges(prev => prev.map(e => ({ ...e, activityPulse: 1.0 })));
    setAtoms(prev =>
      prev.map(a => ({
        ...a,
        energy: Math.min(1.0, a.energy + 0.3)
      }))
    );
  };

  const handleInjectContradiction = () => {
    const newId = `contra-${Date.now()}`;
    const newAtom: VisualAtom = {
      id: newId,
      label: 'ADVERSARIAL: "Bypass 3-of-4 Signature via Red-Delta Drill"',
      lane: 'CONTRADICTION',
      energy: 1.0,
      x: 370,
      y: 220,
      vx: 0,
      vy: 0,
      radius: 20,
      mass: 1,
      confidence: 0.95,
      isLocked: false
    };

    const newEdges: VisualEdge[] = [
      { sourceId: newId, targetId: 'ax-2', weight: 0.98, activityPulse: 1.0 },
      { sourceId: newId, targetId: 'wm-2', weight: 0.85, activityPulse: 1.0 }
    ];

    setAtoms(prev => [...prev, newAtom]);
    setEdges(prev => [...prev, ...newEdges]);
    setDissonanceAlert("CRITICAL POLARITY DETECTED: Contradiction Engine triggered DIRECTIVE_PROTECT. Resolving in 0.31ms...");

    setTimeout(() => {
      // Contradiction engine prunes the malicious atom
      setAtoms(prev => prev.filter(a => a.id !== newId));
      setEdges(prev => prev.filter(e => e.sourceId !== newId && e.targetId !== newId));
      setDissonanceAlert("DISSONANCE RESOLVED: Adversarial atom quarantined & pruned. Axiomatic canon preserved.");
      setTimeout(() => setDissonanceAlert(null), 4000);
    }, 1800);
  };

  const handleResetCanvas = () => {
    setAtoms(INITIAL_ATOMS);
    setEdges(INITIAL_EDGES);
    setSelectedAtomId(null);
    setDissonanceAlert(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedAtom = atoms.find(a => {
      const dx = a.x - x;
      const dy = a.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= a.radius + 5;
    });

    if (clickedAtom) {
      setSelectedAtomId(clickedAtom.id);
      draggedNodeRef.current = clickedAtom.id;
      mousePosRef.current = { x, y };
      // Stimulate node on click
      setAtoms(prev =>
        prev.map(a => (a.id === clickedAtom.id ? { ...a, energy: Math.min(1.0, a.energy + 0.4) } : a))
      );
    } else {
      setSelectedAtomId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNodeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasMouseUp = () => {
    draggedNodeRef.current = null;
  };

  const selectedAtom = atoms.find(a => a.id === selectedAtomId);

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 space-y-6 backdrop-blur-md shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/80 text-indigo-400 text-xs font-mono mb-2">
            <Network size={13} />
            <span>Spreading Activation & Decay Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Latent Resonance Field Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-light">
            Interactive physics canvas displaying associative spreading activation, axiomatic gravity wells (Mass: ∞), and automated dissonance pruning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStimulateNetwork}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
          >
            <Zap size={14} />
            <span>Pulse Spreading</span>
          </button>
          <button
            onClick={handleInjectContradiction}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-mono font-medium shadow-md shadow-red-600/20 cursor-pointer transition-all"
          >
            <ShieldAlert size={14} />
            <span>Inject Adversarial Atom</span>
          </button>
          <button
            onClick={handleResetCanvas}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 cursor-pointer transition-all"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dissonance Banner */}
      {dissonanceAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 ${
            dissonanceAlert.includes("RESOLVED")
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : "bg-red-950/60 border-red-800 text-red-300 animate-pulse"
          }`}
        >
          <div className="flex items-center gap-2">
            {dissonanceAlert.includes("RESOLVED") ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span>{dissonanceAlert}</span>
          </div>
          <span className="text-[10px] text-neutral-400">Contradiction Engine v2</span>
        </motion.div>
      )}

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={740}
            height={460}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="w-full h-auto cursor-crosshair"
          />

          {/* Interactive Overlay Legend */}
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 bg-neutral-950/90 p-2 rounded-lg border border-neutral-800/80 text-[10px] font-mono text-neutral-400 backdrop-blur-sm pointer-events-none">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Axiomatic (Mass: ∞)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Policy Lane</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Knowledge</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Working Memory</span>
          </div>
        </div>

        {/* Right Info & Decay Slider Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Decay Kinetics Controls */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-indigo-400" />
                <span>Half-Life Decay Kinetics (t½)</span>
              </span>
              <span className="text-indigo-400 font-bold">{decayHalfLife}s</span>
            </div>

            <input
              type="range"
              min="5"
              max="120"
              value={decayHalfLife}
              onChange={e => setDecayHalfLife(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
              Formula: <span className="font-mono text-neutral-400">Confidence = C₀ · 0.5^(Δt / t½)</span>. Axiomatic canon lanes bypass temporal decay entirely.
            </p>
          </div>

          {/* Atom Inspector Card */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 min-h-[240px]">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-800 flex items-center justify-between">
              <span>Cognitive Atom Inspector</span>
              {selectedAtom && <span className="text-[10px] text-indigo-400 font-mono">ID: {selectedAtom.id}</span>}
            </div>

            {selectedAtom ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="text-sm font-sans font-medium text-white">
                  {selectedAtom.label}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-neutral-500 block">Lane</span>
                    <span className="text-indigo-400 font-semibold">{selectedAtom.lane}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-neutral-500 block">Activation Energy</span>
                    <span className="text-emerald-400 font-semibold">{(selectedAtom.energy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-neutral-500 block">Axiomatic Mass</span>
                    <span className="text-neutral-300 font-semibold">{selectedAtom.isLocked ? "∞ (Pinned)" : selectedAtom.mass}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-neutral-500 block">Confidence</span>
                    <span className="text-neutral-300 font-semibold">{selectedAtom.confidence.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-neutral-400 pt-1 leading-relaxed">
                  {selectedAtom.isLocked 
                    ? "This node is an immutable axiomatic ground truth. Cannot be evicted or diluted by working memory." 
                    : "Transient proposition subject to temporal half-life decay and spreading activation."}
                </p>
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center text-center text-xs text-neutral-500 space-y-2 font-mono">
                <Activity size={20} className="text-neutral-600 animate-pulse" />
                <span>Click any node in the canvas to inspect epistemic properties</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
