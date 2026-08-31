import React, { useState, useEffect } from 'react';
import { Flame, Activity, Zap } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '../utils';
import { telemetryStore } from '../store';

interface DataPoint {
  time: string;
  load: number;
  divergence: number;
}

export function StressTestView() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    telemetryStore.stressData = data;
  }, [data]);

  useEffect(() => {
    // Initialize data
    const initialData: DataPoint[] = Array.from({ length: 30 }).map((_, i) => ({
      time: new Date(Date.now() - (30 - i) * 1000).toLocaleTimeString([], { second: '2-digit' }),
      load: 30 + Math.random() * 20,
      divergence: 10 + Math.random() * 15,
    }));
    setData(initialData);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        
        // Create a volatile random walk
        let newLoad = last.load + (Math.random() - 0.4) * 18;
        if (newLoad > 95) newLoad -= 15;
        if (newLoad < 20) newLoad += 15;

        let newDiv = last.divergence + (Math.random() - 0.5) * 12;
        if (newDiv > 80) newDiv -= 10;
        if (newDiv < 5) newDiv += 10;
        
        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { second: '2-digit' }),
          load: newLoad,
          divergence: newDiv
        }];
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const currentLoad = data[data.length - 1]?.load || 0;
  const currentDiv = data[data.length - 1]?.divergence || 0;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-amber-500" />
          <h2 className="text-sm font-medium text-neutral-300">Live Stress Diagnostics</h2>
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
            isActive 
              ? "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" 
              : "text-neutral-400 bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
          )}
        >
          {isActive ? (
            <><Activity size={14} className="animate-pulse" /> <span>INJECTING LOAD</span></>
          ) : (
            <><Zap size={14} /> <span>START INJECTION</span></>
          )}
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/50">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Cognitive Load</div>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-3xl font-light tracking-tight transition-colors duration-300",
                currentLoad > 80 ? "text-rose-400" : currentLoad > 60 ? "text-amber-400" : "text-emerald-400"
              )}>
                {currentLoad.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/50">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Semantic Divergence</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light tracking-tight text-indigo-400 transition-colors duration-300">
                {currentDiv.toFixed(1)}
              </span>
              <span className="text-sm text-neutral-500">v/s</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDiv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                domain={[0, 100]}
                tick={{ fill: '#525252' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Area 
                type="monotone" 
                dataKey="load" 
                name="Load (%)" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorLoad)" 
                isAnimationActive={false} 
              />
              <Area 
                type="monotone" 
                dataKey="divergence" 
                name="Divergence" 
                stroke="#818cf8" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorDiv)" 
                isAnimationActive={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
