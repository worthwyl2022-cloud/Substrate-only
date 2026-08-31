import React from 'react';
import { motion } from 'motion/react';
import { Network, Download } from 'lucide-react';
import { SYSTEM_MODULES } from './data';
import { ModuleCard } from './components/ModuleCard';
import { SystemStatus } from './components/SystemStatus';
import { StressTestView } from './components/StressTestView';
import { SystemOverview } from './components/SystemOverview';
import { MemoryUsageView } from './components/MemoryUsageView';
import { telemetryStore } from './store';

export default function App() {
  const handleDownloadDiagnostics = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      system: "CognitiveCore Substrate",
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
    a.download = `cognitive-core-diagnostics-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 pointer-events-none flex justify-center overflow-hidden">
        <div className="w-full max-w-7xl relative">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-8">
        {/* Header / Hero */}
        <header className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 mb-6">
              <Network size={14} className="text-indigo-400" />
              <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">Tier 1 Acquisition Grade</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
              Cognitive<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Core</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed max-w-xl">
              The world's first unified cognitive substrate. Seamlessly orchestrating reasoning, memory, and semantic alignment across parallel logic engines.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block w-72 shrink-0"
          >
            {/* Abstract visual representation of the core */}
            <div className="relative aspect-square rounded-full border border-neutral-800/50 flex items-center justify-center p-8">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full border border-indigo-400/10 animate-[spin_20s_linear_infinite]" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
            </div>
          </motion.div>
        </header>

        <main className="space-y-12">
          {/* System Overview */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SystemOverview />
            </motion.div>
          </section>

          {/* Module Grid */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-medium text-white tracking-tight">Active Architecture</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SYSTEM_MODULES.map((module, idx) => (
                <React.Fragment key={module.id}>
                  <ModuleCard module={module} index={idx} />
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Telemetry & Diagnostics */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-medium text-white tracking-tight">Active Diagnostics</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent" />
              <button
                onClick={handleDownloadDiagnostics}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 transition-all text-sm font-medium text-neutral-300 shrink-0 cursor-pointer shadow-sm"
              >
                <Download size={16} className="text-neutral-400" />
                <span>Download Diagnostics</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
               <SystemStatus />
               <StressTestView />
               <MemoryUsageView />
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
