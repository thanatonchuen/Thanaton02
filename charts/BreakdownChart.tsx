import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyMetric } from '../types';

interface BreakdownChartProps {
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
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({ data }) => {
  return (
     <ResponsiveContainer width="100%" height="100%">
         <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
           <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => val.slice(8)} />
           <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
           
           <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
           <Legend verticalAlign="bottom" height={36} iconType="rect" />
           
           <Bar dataKey="likes" stackId="a" fill="#3b82f6" name="Likes" radius={[0, 0, 4, 4]} barSize={20} />
           <Bar dataKey="comments" stackId="a" fill="#10b981" name="Comments" barSize={20} />
           <Bar dataKey="shares" stackId="a" fill="#f59e0b" name="Shares" radius={[4, 4, 0, 0]} barSize={20} />
         </BarChart>
     </ResponsiveContainer>
  );
};

export default BreakdownChart;