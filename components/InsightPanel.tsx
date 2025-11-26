import React from 'react';
import { UrlItem } from '../types';
import { Sparkles, ExternalLink, AlertCircle } from 'lucide-react';

interface InsightPanelProps {
  isLoading: boolean;
  analysis: string | null;
  urls: UrlItem[];
  error: string | null;
  onAnalyze: () => void;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ isLoading, analysis, urls, error, onAnalyze }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200/60 dark:border-slate-700/60 h-full flex flex-col relative overflow-hidden group transition-all duration-300">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 transition-colors duration-500 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">AI Strategy</h2>
        </div>
        <button 
          onClick={onAnalyze}
          className="group/btn relative px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:shadow-none overflow-hidden"
          disabled={isLoading}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? 'Thinking...' : 'Analyze'} 
            {!isLoading && <Sparkles size={14} className="group-hover/btn:animate-spin" />}
          </span>
          {/* Button Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {isLoading && (
          <div className="space-y-4 animate-pulse mt-4">
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2"></div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-xl text-rose-600 dark:text-rose-300 text-sm flex gap-3 items-start">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && !analysis && (
          <div className="flex flex-col items-center justify-center h-48 text-center mt-2">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-slate-300 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Click "Analyze" to generate insights <br/> based on your current metrics.</p>
          </div>
        )}

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">{analysis}</p>
            </div>
            
            {urls.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Grounding Sources</p>
                <div className="space-y-2">
                  {urls.map((item, i) => (
                    <a 
                      key={i} 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg -mx-2"
                    >
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{item.title || item.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};