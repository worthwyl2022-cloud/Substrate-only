import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Download, Briefcase, Zap, Cpu, ShieldAlert, Code2, Layers, CheckCircle2, Atom, Radio, Scale } from 'lucide-react';
import { SYSTEM_MODULES } from './data';
import { ModuleCard } from './components/ModuleCard';
import { SystemStatus } from './components/SystemStatus';
import { StressTestView } from './components/StressTestView';
import { SystemOverview } from './components/SystemOverview';
import { MemoryUsageView } from './components/MemoryUsageView';
import { InteractiveGovernancePlayground } from './components/InteractiveGovernancePlayground';
import { AcquisitionDataRoom } from './components/AcquisitionDataRoom';
import { MultiTurnStressArena } from './components/MultiTurnStressArena';
import { KotlinCodeSandbox } from './components/KotlinCodeSandbox';
import { ResonanceFieldCanvas } from './components/ResonanceFieldCanvas';
import { CreativeNervousSystem } from './components/CreativeNervousSystem';
import { HybridContradictionBenchmark } from './components/HybridContradictionBenchmark';
import { CryptographicReceiptVerifier } from './components/CryptographicReceiptVerifier';
import { ComprehensiveStressBenchmark } from './components/ComprehensiveStressBenchmark';
import { telemetryStore } from './store';

export default function App() {
  const [mainView, setMainView] = useState<'GOVERNANCE' | 'CREATIVE_CORE' | 'ARENA' | 'BENCHMARK_50' | 'ARCHITECTURE' | 'DATA_ROOM' | 'DIAGNOSTICS'>('GOVERNANCE');

  const handleDownloadDiagnostics = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      system: "Cranium Substrate™",
      status: "NOMINAL",
      activeModules: SYSTEM_MODULES,
      telemetry: {
        logs: telemetryStore.logs,
        stressData: telemetryStore.stressData,
        memoryData: telemetryStore.memoryData
      }
    };
    
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cranium-substrate-diagnostics-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none flex justify-center overflow-hidden">
        <div className="w-full max-w-7xl relative">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-8 md:py-12 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-800/80 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-3">
              <Network size={14} className="text-indigo-400" />
              <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">Tier-3 Epistemic Governance Substrate · 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
              Cranium <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-200">Substrate™</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl">
              Deterministic epistemic governance above models and below applications. Built by Wyl Mathes.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadDiagnostics}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition-all cursor-pointer"
            >
              <Download size={14} className="text-indigo-400" />
              <span>Export Audit Data</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>0.34ms Substrate Gate Active</span>
            </div>
          </div>
        </header>

        {/* Global View Nav */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800/80 gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setMainView('GOVERNANCE')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'GOVERNANCE'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Zap size={14} /> <span>1. Governance Lab</span>
            </button>
            <button
              onClick={() => setMainView('CREATIVE_CORE')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'CREATIVE_CORE'
                  ? 'bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-600/20'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-neutral-800/50'
              }`}
            >
              <Radio size={14} className="animate-pulse" /> <span>2. Creative OS v2.1</span>
            </button>
            <button
              onClick={() => setMainView('ARENA')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'ARENA'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <ShieldAlert size={14} /> <span>3. Adversarial Arena</span>
            </button>
            <button
              onClick={() => setMainView('BENCHMARK_50')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'BENCHMARK_50'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-indigo-400/90 hover:text-indigo-300 hover:bg-neutral-800/50'
              }`}
            >
              <Scale size={14} className="animate-pulse" /> <span>4. 50-Variant Stress Suite</span>
            </button>
            <button
              onClick={() => setMainView('ARCHITECTURE')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'ARCHITECTURE'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Code2 size={14} /> <span>5. Kotlin Core & Field</span>
            </button>
            <button
              onClick={() => setMainView('DATA_ROOM')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'DATA_ROOM'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Briefcase size={14} /> <span>6. Data Room</span>
            </button>
            <button
              onClick={() => setMainView('DIAGNOSTICS')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === 'DIAGNOSTICS'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Cpu size={14} /> <span>7. Telemetry</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-neutral-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 size={14} /> Sub-0.34ms Polarity Gate
            </span>
            <span>|</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Atom size={13} /> Multi-Scale Field (v2.1)
            </span>
          </div>
        </div>

        <main className="space-y-12">
          {/* VIEW 1: GOVERNANCE WORKBENCH */}
          {mainView === 'GOVERNANCE' && (
            <div className="space-y-12">
              <section>
                <InteractiveGovernancePlayground />
              </section>
              <section>
                <SystemOverview />
              </section>
            </div>
          )}

          {/* VIEW 2: DYNAMICAL CREATIVE OS V2.1 */}
          {mainView === 'CREATIVE_CORE' && (
            <div className="space-y-12">
              <section>
                <CreativeNervousSystem />
              </section>
            </div>
          )}

          {/* VIEW 3: ADVERSARIAL ARENA & CASCADE */}
          {mainView === 'ARENA' && (
            <div className="space-y-12">
              <section>
                <MultiTurnStressArena />
              </section>
              <section>
                <HybridContradictionBenchmark />
              </section>
            </div>
          )}

          {/* VIEW 4: 50-VARIANT DUE DILIGENCE STRESS BENCHMARK */}
          {mainView === 'BENCHMARK_50' && (
            <div className="space-y-12">
              <section>
                <ComprehensiveStressBenchmark />
              </section>
            </div>
          )}

          {/* VIEW 4: KOTLIN ARCHITECTURE & RESONANCE FIELD */}
          {mainView === 'ARCHITECTURE' && (
            <div className="space-y-12">
              <section>
                <CreativeNervousSystem />
              </section>
              <section>
                <ResonanceFieldCanvas />
              </section>
              <section>
                <KotlinCodeSandbox />
              </section>
              <section>
                <CryptographicReceiptVerifier />
              </section>
            </div>
          )}

          {/* VIEW 4: TECHNICAL ACQUISITION DATA ROOM */}
          {mainView === 'DATA_ROOM' && (
            <div className="space-y-12">
              <section>
                <AcquisitionDataRoom />
              </section>
            </div>
          )}

          {/* VIEW 5: ARCHITECTURE & TELEMETRY */}
          {mainView === 'DIAGNOSTICS' && (
            <div className="space-y-12">
              {/* Architecture Modules */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-lg font-medium text-white tracking-tight">Active Substrate Architecture</h2>
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SYSTEM_MODULES.map((module, idx) => (
                    <React.Fragment key={module.id}>
                      <ModuleCard module={module} index={idx} />
                    </React.Fragment>
                  ))}
                </div>
              </section>

              {/* Telemetry & Stress Diagnostics */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-lg font-medium text-white tracking-tight">Active Telemetry & Stress Diagnostics</h2>
                  <div className="flex-1 h-px bg-neutral-800" />
                  <button
                    onClick={handleDownloadDiagnostics}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-300 cursor-pointer"
                  >
                    <Download size={14} className="text-neutral-400" />
                    <span>Export Diagnostics</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <SystemStatus />
                  <StressTestView />
                  <MemoryUsageView />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
