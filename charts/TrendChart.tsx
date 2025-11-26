import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DailyMetric } from '../types';
import { useTheme } from '../ThemeContext';

interface TrendChartProps {
  data: DailyMetric[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => val.slice(5)}
          dy={10}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            backdropFilter: 'blur(8px)',
            borderRadius: 12, 
            border: `1px solid ${tooltipBorder}`, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            color: tooltipText,
            padding: '8px 12px'
          }}
          itemStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '2px', paddingBottom: '2px' }}
          labelStyle={{ color: tickColor, fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        />
        <Area 
          type="monotone" 
          dataKey="reach" 
          stroke="#6366f1" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorReach)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
        />
        <Area 
          type="monotone" 
          dataKey="engagement" 
          stroke="#10b981" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorEngagement)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;