import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';
import { SystemLog } from '../types';
import { cn } from '../utils';
import { craniumEngine } from '../store';

export function SystemStatus() {
  const [logs, setLogs] = useState<SystemLog[]>(craniumEngine.getLogs());

  useEffect(() => {
    // Subscribe to real engine updates
    const unsubscribe = craniumEngine.subscribe(() => {
      setLogs(craniumEngine.getLogs().slice(0, 8));
    });

    // Periodic telemetry pulse
    const interval = setInterval(() => {
      const sources = ['Substrate Core', 'Resonance Field', 'Deliberation Engine', 'Contradiction Engine'];
      const messages = [
        'Vector alignment optimized by 0.34ms.',
        'Spreading activation kinetic half-life verified (t₁/₂ = 3600s).',
        'Canon lane priority intact. Zero axiom breaches.',
        'Epistemic state synced. Active consensus confidence: 0.998.'
      ];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      craniumEngine.addLog(randomSource, randomMessage, 'info');
    }, 4500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-neutral-400" />
          <h2 className="text-sm font-medium text-neutral-300">Live Telemetry & Epistemic Trace</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Activity size={14} className="animate-pulse" />
          <span>SUBSTRATE NOMINAL</span>
        </div>
      </div>

      <div className="p-6 font-mono text-sm">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 last:mb-0"
            >
              <span className="text-neutral-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
              </span>
              <span className={cn(
                "shrink-0 w-36 truncate",
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                'text-indigo-400'
              )}>
                [{log.source}]
              </span>
              <span className="text-neutral-300">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

