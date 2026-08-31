import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { telemetryStore } from '../store';
import { cn } from '../utils';

export function SystemOverview() {
  const [data, setData] = useState<any[]>([]);
  const [currentLoad, setCurrentLoad] = useState<number>(0);

  useEffect(() => {
    const fetchTelemetry = () => {
      const stressData = telemetryStore.stressData || [];
      if (stressData.length > 0) {
        setData([...stressData]);
        setCurrentLoad(stressData[stressData.length - 1].load);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  const getLoadColor = (load: number) => {
    if (load > 80) return "text-rose-400";
    if (load > 60) return "text-amber-400";
    return "text-emerald-400";
  };

  const getBgColor = (load: number) => {
    if (load > 80) return "bg-rose-400";
    if (load > 60) return "bg-amber-400";
    return "bg-emerald-400";
  };

  const getStrokeColor = (load: number) => {
    if (load > 80) return "#fb7185"; // rose-400
    if (load > 60) return "#fbbf24"; // amber-400
    return "#34d399"; // emerald-400
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group shadow-lg">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/50 flex items-center justify-center shrink-0">
          <Cpu size={28} className={getLoadColor(currentLoad)} />
        </div>
        
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
            Global System Load
            <span className="relative flex h-2 w-2">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", getBgColor(currentLoad))}></span>
              <span className={cn("relative inline-flex rounded-full h-2 w-2", getBgColor(currentLoad))}></span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-4xl font-light tracking-tight transition-colors duration-300", getLoadColor(currentLoad))}>
              {currentLoad.toFixed(1)}%
            </span>
            <span className="text-sm font-medium text-neutral-500 tracking-wide">capacity</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-72 h-16 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.slice(-20)}>
            <defs>
              <linearGradient id="colorSpark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getStrokeColor(currentLoad)} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getStrokeColor(currentLoad)} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="load" 
              stroke={getStrokeColor(currentLoad)} 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorSpark)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
