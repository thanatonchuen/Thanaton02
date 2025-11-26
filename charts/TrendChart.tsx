import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DailyMetric } from '../types';
import { useTheme } from '../ThemeContext';

interface TrendChartProps {
  data: DailyMetric[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#f8fafc';
  const tooltipText = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: tickColor }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => val.slice(5)}
          dy={10}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: tickColor }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
        />
        <Tooltip
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
        <Line type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;