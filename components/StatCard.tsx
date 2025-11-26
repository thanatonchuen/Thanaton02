import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  const changeColor = change && change >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = change && change >= 0 ? '+' : '';
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 border border-gray-100 dark:border-slate-700 flex items-center justify-between hover:shadow-lg transition-all duration-200">
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
        {change !== undefined && <span className={`${changeColor} text-xs mt-1 block font-medium`}>{changeSign}{change}%</span>}
      </div>
      {icon && <div className="text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">{icon}</div>}
    </div>
  );
};