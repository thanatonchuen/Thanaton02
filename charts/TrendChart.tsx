import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend } from 'recharts';
import { DailyMetric } from '../types';

interface TrendChartProps {
  data: DailyMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-100 ring-1 ring-slate-200/50">
        <p className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                 <span className="font-medium text-slate-500 capitalize">{entry.name}</span>
              </div>
              <span className="font-bold font-mono text-slate-700">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => val.slice(5)} />
        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`} />
        
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        
        <Area type="monotone" dataKey="reach" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" activeDot={{ r: 6 }} name="Reach" />
        <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorEngage)" activeDot={{ r: 6 }} name="Engagement" />
        
        <Brush 
          dataKey="date" 
          height={30} 
          stroke="#64748b" 
          fill="#f1f5f9"
          tickFormatter={(val) => val.slice(5)}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;