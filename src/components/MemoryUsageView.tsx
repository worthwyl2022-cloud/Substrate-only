import React, { useState, useEffect } from 'react';
import { HardDrive } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { cn } from '../utils';
import { telemetryStore } from '../store';

interface MemoryPoint {
  time: string;
  usage: number; // in GB
}

export function MemoryUsageView() {
  const [data, setData] = useState<MemoryPoint[]>([]);

  useEffect(() => {
    telemetryStore.memoryData = data;
  }, [data]);

  useEffect(() => {
    // Initialize 60 seconds of data
    const initialData: MemoryPoint[] = Array.from({ length: 60 }).map((_, i) => ({
      time: new Date(Date.now() - (60 - i) * 1000).toLocaleTimeString([], { second: '2-digit' }),
      usage: 3.5 + Math.random() * 0.5,
    }));
    setData(initialData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        
        // Random walk with GC
        let newUsage = last.usage + (Math.random() - 0.45) * 0.15;
        
        // Simulate Garbage Collection drop if memory gets too high
        if (newUsage > 7.5) {
            newUsage -= (1.5 + Math.random() * 1.0);
        }
        if (newUsage < 2.0) newUsage += 1.0;
        
        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { second: '2-digit' }),
          usage: newUsage
        }];
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentUsage = data[data.length - 1]?.usage || 0;
  const utilization = (currentUsage / 8.0) * 100; // Assume 8GB max for percentage

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <HardDrive size={18} className="text-cyan-400" />
          <h2 className="text-sm font-medium text-neutral-300">Memory Allocation</h2>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/50">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Heap Usage</div>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-3xl font-light tracking-tight transition-colors duration-300",
                utilization > 85 ? "text-rose-400" : utilization > 65 ? "text-amber-400" : "text-cyan-400"
              )}>
                {currentUsage.toFixed(2)}
              </span>
              <span className="text-sm text-neutral-500">GB</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/50">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Utilization</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light tracking-tight text-neutral-300 transition-colors duration-300">
                {utilization.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#525252' }}
              />
              <YAxis 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 8]}
                tick={{ fill: '#525252' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                name="Usage (GB)" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
