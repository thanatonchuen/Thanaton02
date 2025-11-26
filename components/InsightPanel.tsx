import React from 'react';
import { Sparkles, ExternalLink, Loader2, Globe } from 'lucide-react';

interface InsightPanelProps {
  isLoading: boolean;
  analysis: string | null;
  urls: string[];
  error: string | null;
  onAnalyze: () => void;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ isLoading, analysis, urls, error, onAnalyze }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-500 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Strategic Analysis</h2>
            <div className="flex items-center gap-2 text-indigo-100 text-sm">
               <span>Powered by Gemini 2.5 Flash</span>
               <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
               <span className="flex items-center gap-1"><Globe size={12} /> Online Data Grounding</span>
            </div>
          </div>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg
            ${isLoading 
              ? 'bg-indigo-800/50 text-indigo-300 cursor-not-allowed' 
              : 'bg-white text-indigo-700 hover:bg-indigo-50 hover:scale-105 active:scale-95'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing Real-time Data...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Insights (วิเคราะห์)
            </>
          )}
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-inner min-h-[200px] text-slate-800">
        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 mb-4 flex items-center gap-2">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {!analysis && !isLoading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
            <Sparkles size={48} className="mb-4 text-indigo-200" />
            <p className="text-lg font-medium text-slate-600">Ready to analyze Walailak Channel metrics</p>
            <p className="text-sm max-w-md mt-2">Click "Generate Insights" to correlate your data with real-time trends in Thailand and receive an AI-powered strategy.</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 animate-pulse py-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-100 rounded-full"></div>
               <div className="h-4 bg-indigo-50 rounded w-1/3"></div>
            </div>
            <div className="space-y-3">
               <div className="h-3 bg-slate-100 rounded w-full"></div>
               <div className="h-3 bg-slate-100 rounded w-full"></div>
               <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            </div>
            <div className="h-32 bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
        )}

        {analysis && !isLoading && (
          <div className="animate-fadeIn">
             <div className="prose prose-sm md:prose-base prose-indigo max-w-none text-slate-700">
                 <div className="whitespace-pre-line leading-relaxed font-thai">
                   {analysis}
                 </div>
             </div>
             
             {urls.length > 0 && (
               <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Globe size={14} /> Sources & Online Trends
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                   {urls.map((url, idx) => (
                     <a 
                       key={idx} 
                       href={url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 hover:underline group bg-white p-2 rounded border border-slate-200 hover:border-indigo-200 transition-colors"
                     >
                       <ExternalLink size={12} className="mr-2 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                       <span className="truncate">{url}</span>
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