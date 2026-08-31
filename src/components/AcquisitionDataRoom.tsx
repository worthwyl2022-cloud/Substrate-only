import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Coins, 
  Calendar, 
  Download, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Code2, 
  Cpu, 
  ExternalLink,
  Lock,
  GitBranch,
  FileCheck,
  Building2,
  Briefcase,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

export function AcquisitionDataRoom() {
  const [activeSection, setActiveSection] = useState<'ONE_PAGER' | 'ASSETS' | 'RISKS' | 'VALUATION' | 'ROADMAP'>('ONE_PAGER');

  const assetInventory = [
    {
      item: 'Android Substrate Core (Kotlin)',
      location: 'WorthWyl-game-changer',
      role: 'SubstrateCore, immune reaction subsystem, dynamic field memory simulator.',
      maturity: 'Working Prototype (Production Kotlin)',
      status: 'VERIFIED'
    },
    {
      item: 'Governance Modules',
      location: 'substrate/governance/',
      role: 'CanonLane (Mass: ∞), ContradictionEngine (Proxy v2), OutputEvaluator, DeliberationEngine.',
      maturity: 'Sub-ms Algorithm Suite',
      status: 'VERIFIED'
    },
    {
      item: 'Benchmark Harness Suite',
      location: 'benchmark/',
      role: '1,420 vector adversarial corpus schema, methodology runners, regression trackers.',
      maturity: 'Frozen Schema v1.0',
      status: 'VERIFIED'
    },
    {
      item: 'LLM-Judge Adapter',
      location: 'judge/adapter.ts',
      role: 'Drop-in secondary gate behind contradiction path for high-ambiguity semantic paraphrase.',
      maturity: 'Adapter Integrated',
      status: 'VERIFIED'
    },
    {
      item: 'Product API Surface',
      location: 'product/',
      role: 'Multi-project isolation, constitutional policy editor, quarantine inbox, SHA-256 provenance stubs.',
      maturity: 'Tier-3 Surface Ready',
      status: 'VERIFIED'
    },
    {
      item: 'Diligence Specification',
      location: 'docs/ACQUISITION_ONE_PAGER.md',
      role: 'Transparent honest baseline statement, valuation guidance, and technical diligence manifest.',
      maturity: 'August 2026 Frozen',
      status: 'VERIFIED'
    }
  ];

  const handleExportDataRoom = () => {
    const dataRoomBundle = {
      assetClass: "Pre-revenue creative-governance prototype (IP + architecture + working substrate)",
      version: "2026-08 (Honest Tier-3 Diligence Package)",
      creator: "Wyl Mathes",
      behavioralContract: "Intention → Identity → Memory Permanence → Conflict as Signal → Directive-Driven Next Move",
      assets: assetInventory,
      truthTable: [
        { claim: "Canon Recall vs Naive RAG", reality: "Not established yet; known gap with 90-day fix path via frozen real-model harness." },
        { claim: "Contradiction Engine", reality: "Dual-gate: Fast NLI-proxy v2 (0.28ms) + LLM-judge adapter fallback." },
        { claim: "Multi-tenant Platform", reality: "Single-process / in-memory field with clean project isolation architecture." },
        { claim: "Revenue / Users / ARR", reality: "Pre-revenue prototype." },
        { claim: "Valuation Posture", reality: "IP prototype pricing ($XXk-$XXXk) based on architecture and contract." }
      ],
      nineDayRoadmap: [
        "1. Run frozen corpus on real LLMs; publish methodology + anonymized raw outputs.",
        "2. Wire LLM-judge as default contradiction gate; keep proxy as prefilter.",
        "3. Ship project isolation + constitution editor + quarantine inbox.",
        "4. Persistence + audit export.",
        "5. Side-by-side demo video: constitution → violation → PROTECT → regenerate vs RAG."
      ],
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataRoomBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cranium-core-diligence-data-room-2026-08.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEngine.playReceiptSign();
  };

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/95 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Briefcase size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight font-sans">
                Cranium Core — Technical Acquisition Data Room
              </h2>
              <span className="px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/50 text-indigo-300 text-[10px] font-mono font-bold">
                TIER-3 ACQUISITION DILIGENCE (2026-08)
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Asset Class: Pre-revenue creative-governance prototype (IP + architecture + working substrate).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportDataRoom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono transition-colors cursor-pointer"
          >
            <Download size={13} className="text-indigo-400" />
            <span>Export Data Room (JSON)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-6 border-b border-neutral-800/80 flex items-center gap-1 overflow-x-auto text-xs font-mono">
        {[
          { id: 'ONE_PAGER', label: 'Honest One-Pager', icon: FileText },
          { id: 'ASSETS', label: 'Asset Inventory & Codebase', icon: Layers },
          { id: 'RISKS', label: 'Diligence Risk Register', icon: AlertTriangle },
          { id: 'VALUATION', label: 'Valuation Posture & Moat', icon: Coins },
          { id: 'ROADMAP', label: '90-Day Remediation Plan', icon: Calendar },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id as any);
                soundEngine.playPulse();
              }}
              className={`px-4 py-2.5 border-b-2 font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-neutral-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="p-6">
        {/* TAB 1: ONE PAGER */}
        {activeSection === 'ONE_PAGER' && (
          <div className="space-y-6 max-w-5xl">
            {/* Buyer Statement Box */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck size={14} /> Honest Buyer Statement (Diligence Ground Truth)
              </div>
              <blockquote className="text-xs sm:text-sm font-sans text-neutral-200 leading-relaxed italic">
                "Cranium Core is a documented creative-governance prototype. Receipts demonstrate operational directives, identity-gate activity, quarantine write-back, and explicit memory governance. Comparative canon superiority is <strong>not</strong> claimed until a frozen, real-model harness shows it. The acquisition opportunity is the <strong>architecture, behavioral contract, and remediation path</strong>—not marketed performance superiority."
              </blockquote>
            </div>

            {/* Truth Table: Claim vs Reality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                  Technical Reality Check (What It Is vs What It Is Not Yet)
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">Survives Technical Due Diligence</span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden text-xs">
                <div className="grid grid-cols-12 bg-neutral-900/90 px-4 py-2.5 border-b border-neutral-800 text-[11px] font-semibold text-neutral-400">
                  <div className="col-span-4">MARKETED / COMMON CLAIM</div>
                  <div className="col-span-8">HONEST TECHNICAL REALITY</div>
                </div>

                <div className="divide-y divide-neutral-850">
                  <div className="grid grid-cols-12 px-4 py-3 items-start gap-2">
                    <div className="col-span-4 text-neutral-200 font-semibold font-sans">
                      Proven better canon recall than RAG
                    </div>
                    <div className="col-span-8 text-neutral-300 font-sans leading-relaxed">
                      <span className="text-amber-400 font-bold font-mono">Not established.</span> Early automated runs showed canon regression vs naïve RAG; treat as a known gap with a defined fix path.
                    </div>
                  </div>

                  <div className="grid grid-cols-12 px-4 py-3 items-start gap-2">
                    <div className="col-span-4 text-neutral-200 font-semibold font-sans">
                      Full NLI Contradiction Engine
                    </div>
                    <div className="col-span-8 text-neutral-300 font-sans leading-relaxed">
                      <span className="text-indigo-400 font-bold font-mono">Dual-gate Architecture:</span> NLI-proxy v2 (0.28ms) + optional LLM-judge adapter; not a trained CrossEncoder in the Android build.
                    </div>
                  </div>

                  <div className="grid grid-cols-12 px-4 py-3 items-start gap-2">
                    <div className="col-span-4 text-neutral-200 font-semibold font-sans">
                      Multi-tenant Production Platform
                    </div>
                    <div className="col-span-8 text-neutral-300 font-sans leading-relaxed">
                      Single-process / in-memory field; project isolation is designed and mocked in product surface, not battle-tested at multi-region scale.
                    </div>
                  </div>

                  <div className="grid grid-cols-12 px-4 py-3 items-start gap-2">
                    <div className="col-span-4 text-neutral-200 font-semibold font-sans">
                      Revenue / Users / ARR
                    </div>
                    <div className="col-span-8 text-neutral-400 font-sans">
                      <span className="text-neutral-500 font-mono">None (Pre-revenue prototype).</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 px-4 py-3 items-start gap-2">
                    <div className="col-span-4 text-neutral-200 font-semibold font-sans">
                      $10M–$30B Valuation Comps
                    </div>
                    <div className="col-span-8 text-neutral-400 font-sans leading-relaxed">
                      Decorative if applied to a pre-product prototype; ignore for technical diligence. Price on working code and IP transfer.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSET INVENTORY */}
        {activeSection === 'ASSETS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                Verifiable Codebase & IP Asset Inventory
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 size={12} /> 6/6 CORE ASSETS AUDITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetInventory.map((asset) => (
                <div
                  key={asset.item}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white font-sans flex items-center gap-1.5">
                      <Code2 size={14} className="text-indigo-400" />
                      {asset.item}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800/40">
                      {asset.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                    {asset.location}
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">{asset.role}</p>
                  <div className="pt-1 text-[10px] font-mono text-neutral-500">
                    Maturity: <strong className="text-neutral-300">{asset.maturity}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DILIGENCE RISK REGISTER */}
        {activeSection === 'RISKS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                Risks a Competent Buyer Will Price
              </h3>
              <span className="text-[10px] text-amber-400 font-mono">Transparent Mitigation Roadmap</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  risk: '1. Canon / Metric Proof Gap',
                  detail: 'Automated canon superiority claims require real-model validation under frozen corpus.',
                  mitigation: '90-day harness runs frozen corpus across GPT-4o, Claude 3.5, Gemini 1.5 with published raw JSON dumps.',
                  severity: 'HIGH'
                },
                {
                  risk: '2. Proxy vs NLI False Negatives',
                  detail: 'Simple keyword/proxy engines risk missing novel paraphrased contradictions.',
                  mitigation: 'Wire LLM-judge adapter as default secondary gate behind the 0.28ms fast proxy prefilter.',
                  severity: 'MEDIUM'
                },
                {
                  risk: '3. Key-Person / Single Maintainer',
                  detail: 'Original architecture built by Wyl Mathes.',
                  mitigation: 'Defined contractual transition and knowledge transfer window during acquisition closing.',
                  severity: 'MEDIUM'
                },
                {
                  risk: '4. Overclaim History in Old Decks',
                  detail: 'Prior presentations referenced decorative unicorn valuation comps.',
                  mitigation: 'Corrected completely in honest data room; valuations explicitly anchored on working code and IP.',
                  severity: 'LOW'
                },
                {
                  risk: '5. Dependency & License Lineage',
                  detail: 'SDK client versions, embeddings libraries, and Android Kotlin runtime dependencies.',
                  mitigation: 'Full clean-room dependency audit with zero proprietary secrets or third-party license conflicts.',
                  severity: 'LOW'
                }
              ].map((r) => (
                <div key={r.risk} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-sans">{r.risk}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      r.severity === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                      r.severity === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans">{r.detail}</p>
                  <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] text-indigo-300 font-sans">
                    <strong>Mitigation / Fix Path:</strong> {r.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VALUATION POSTURE & MOAT */}
        {activeSection === 'VALUATION' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Real Moat */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                  <CheckCircle2 size={15} /> Real Moat (Defensible IP)
                </div>
                <ul className="space-y-2 text-xs text-neutral-200 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Behavioral Contract:</strong> Intention → Identity → Memory Permanence → Conflict as Signal → Directive-Driven Next Move.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Quarantine Boundary:</strong> Generated material is provisional until verified; never pollutes permanent canon.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Immune Incidents:</strong> Violations log as adaptive constitutional memory schemas with write-back gates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Builder-Facing "Creative Constitution" Model:</strong> Deterministic constraint enforcement above models.</span>
                  </li>
                </ul>
              </div>

              {/* Cosmetic / Easily Copied */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold font-mono uppercase tracking-wider">
                  <XCircle size={15} className="text-rose-400" /> Cosmetic / Easily Copied (Do Not Overprice)
                </div>
                <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✗</span>
                    <span>Field simulation metaphors alone without write-back enforcement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✗</span>
                    <span>Naïve hash / theme embeddings without polarity dual-lanes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✗</span>
                    <span>Dashboard telemetry metrics without real quarantine write-back gates.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Valuation Posture Guidance */}
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Valuation Posture Guidance (Not ARR Multiples)
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                <strong>Clean IP Sale / Prototype Package:</strong> Low five figures to low six figures depending on exclusivity, transition support window, and frozen proof status.
              </p>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                <strong>Strategic Premium:</strong> Unlocks after (a) real-model harness outperforms baselines on identity/constraint preservation and (b) thin multi-tenant product surface is deployed.
              </p>
              <div className="text-[11px] text-amber-400/90 font-mono pt-1">
                * Note: SaaS revenue multiples do not apply until ARR exists. Do not anchor diligence on ARR-multiple blog posts.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 90-DAY REMEDIATION ROADMAP */}
        {activeSection === 'ROADMAP' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                90-Day Path to a Stronger Tier-3 Acquisition Package
              </h3>
              <span className="text-[10px] text-indigo-400 font-mono">5 Concrete Milestones</span>
            </div>

            <div className="space-y-3">
              {[
                { step: 'Phase 1 (Days 1–20)', title: 'Frozen Corpus on Real LLMs', desc: 'Run frozen 1,420 vector corpus on GPT-4o, Claude 3.5, Gemini 1.5; publish methodology + anonymized raw JSON outputs.' },
                { step: 'Phase 2 (Days 21–40)', title: 'LLM-Judge as Default Contradiction Gate', desc: 'Wire LLM-judge as default contradiction gate; keep sub-ms NLI proxy as fast prefilter.' },
                { step: 'Phase 3 (Days 41–60)', title: 'Project Isolation & Constitution UI', desc: 'Ship complete project isolation workspace + visual constitution editor + quarantine inbox.' },
                { step: 'Phase 4 (Days 61–75)', title: 'Durable Persistence & Audit Export', desc: 'Integrate cryptographic audit state chain + automated diligence bundle export.' },
                { step: 'Phase 5 (Days 76–90)', title: 'Side-by-Side Demo Video', desc: 'Produce side-by-side proof video: Constitution → Violation → PROTECT → Regenerate vs Naïve RAG.' }
              ].map((phase, idx) => (
                <div key={phase.step} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-4">
                  <div className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-800/40 shrink-0">
                    {phase.step}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white font-sans">{phase.title}</div>
                    <p className="text-xs text-neutral-400 font-sans">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
