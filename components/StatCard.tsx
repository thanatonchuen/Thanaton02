import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  const changeColor = change && change >= 0 ? 'text-emerald-500' : 'text-rose-500';
  const changeBg = change && change >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20';
  const changeSign = change && change >= 0 ? '+' : '';
  
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md p-5 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-900/50">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
        
        {change !== undefined && (
          <div className="mt-2 flex items-center">
             <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${changeColor} ${changeBg}`}>
                {changeSign}{change}%
             </span>
             <span className="text-xs text-slate-400 ml-2">vs last month</span>
          </div>
        )}
      </div>
      
      {icon && (
        <div className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
    </div>
  );
};