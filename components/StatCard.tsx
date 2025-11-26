import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number; // percentage change
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, colorClass }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  // Use provided colorClass or default to a neutral gray background if not provided
  const bgClass = colorClass || 'bg-slate-100 text-slate-600';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${bgClass} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-slate-500'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : isNegative ? <ArrowDownRight size={16} /> : <Minus size={16} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};