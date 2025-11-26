import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DailyMetric } from '../types';
import { useTheme } from '../ThemeContext';

interface BreakdownChartProps {
  data: DailyMetric[];
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => val.slice(8)}
          dy={10}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          contentStyle={{ 
            backgroundColor: tooltipBg,
            backdropFilter: 'blur(8px)',
            borderRadius: 12, 
            border: `1px solid ${tooltipBorder}`, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: tooltipText,
            padding: '8px 12px'
          }}
          itemStyle={{ fontSize: '12px', fontWeight: 600 }}
          labelStyle={{ color: tickColor, fontSize: '11px', marginBottom: '8px' }}
        />
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: tickColor, fontWeight: 500 }}
        />
        <Bar dataKey="likes" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} barSize={16} />
        <Bar dataKey="comments" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={16} />
        <Bar dataKey="shares" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownChart;