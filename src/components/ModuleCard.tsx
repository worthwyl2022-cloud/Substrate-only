import React from 'react';
import { motion } from 'motion/react';
import { Cpu, GitCompare, BrainCircuit, Waves, ShieldAlert, CheckSquare } from 'lucide-react';
import { CognitiveModule } from '../types';
import { cn } from '../utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  GitCompare,
  BrainCircuit,
  Waves,
  ShieldAlert,
  CheckSquare
};

interface ModuleCardProps {
  module: CognitiveModule;
  index: number;
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const Icon = ICON_MAP[module.icon] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-neutral-800/50 text-indigo-400 group-hover:text-indigo-300 transition-colors">
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <div className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border",
            module.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            module.status === 'standby' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
            "bg-blue-500/10 text-blue-400 border-blue-500/20"
          )}>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                module.status === 'active' ? "bg-emerald-400 animate-pulse" :
                module.status === 'standby' ? "bg-amber-400" :
                "bg-blue-400 animate-pulse"
              )} />
              <span className="uppercase tracking-wider text-[10px]">{module.status}</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-neutral-200 mb-2 tracking-tight">
          {module.name}
        </h3>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          {module.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {module.metrics.map((metric, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{metric.label}</span>
              <span className="text-sm font-medium text-neutral-300">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
