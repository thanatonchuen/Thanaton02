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

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#f8fafc';
  const tooltipText = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: tickColor }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => val.slice(8)}
          dy={10}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: tickColor }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.5 }}
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            borderRadius: 12, 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            color: tooltipText
          }}
          itemStyle={{ fontSize: '12px', fontWeight: 500 }}
          labelStyle={{ color: tickColor, fontSize: '12px', marginBottom: '8px' }}
        />
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', color: tickColor }}
        />
        <Bar dataKey="likes" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} barSize={24} />
        <Bar dataKey="comments" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={24} />
        <Bar dataKey="shares" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownChart;