import React from 'react';

interface InsightPanelProps {
  isLoading: boolean;
  analysis: string | null;
  urls: string[];
  error: string | null;
  onAnalyze: () => void;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ isLoading, analysis, urls, error, onAnalyze }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Insights</h2>
        <button 
          onClick={onAnalyze}
          className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-600">
        {isLoading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        )}
        
        {error && <p className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">{error}</p>}
        
        {!isLoading && !analysis && !error && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
             <p className="text-gray-400 dark:text-slate-500 text-sm italic">
               Click analyze to generate strategic insights based on your data.
             </p>
          </div>
        )}

        {analysis && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-800 dark:text-slate-200 whitespace-pre-line leading-relaxed text-sm">{analysis}</p>
          </div>
        )}
        
        {urls.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-gray-500 dark:text-slate-400 text-xs mb-2 font-medium">Sources & Trends:</p>
            <ul className="text-indigo-600 dark:text-indigo-400 text-xs space-y-1">
              {urls.map((u, i) => (
                <li key={i}>
                  <a href={u} target="_blank" rel="noopener noreferrer" className="hover:underline truncate block">
                    {u}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};