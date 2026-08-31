import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';
import { INITIAL_LOGS } from '../data';
import { SystemLog } from '../types';
import { cn } from '../utils';
import { telemetryStore } from '../store';

export function SystemStatus() {
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  useEffect(() => {
    telemetryStore.logs = logs;
  }, [logs]);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: SystemLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        source: ['Substrate Core', 'Resonance Field', 'Deliberation Engine'][Math.floor(Math.random() * 3)],
        message: [
          'Vector alignment optimized by 1.2%',
          'Memory route cache cleared.',
          'Lane parallelization stable.',
          'Semantic cluster updated.',
        ][Math.floor(Math.random() * 4)],
        type: Math.random() > 0.8 ? 'warning' : 'info'
      };

      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-neutral-400" />
          <h2 className="text-sm font-medium text-neutral-300">Live Telemetry</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <Activity size={14} className="animate-pulse" />
          <span>SYSTEM NOMINAL</span>
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
                "shrink-0 w-32 truncate",
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
