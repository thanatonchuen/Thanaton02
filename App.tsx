import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, MessageCircle, Share2, BarChart3, RefreshCw, Sun, Moon, Menu } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { InsightPanel } from './components/InsightPanel';
import { ChatInterface } from './components/ChatInterface';
import TrendChart from './charts/TrendChart';
import BreakdownChart from './charts/BreakdownChart';
import { fetchRealFacebookData } from './services/facebookService';
import { analyzeSocialInsights } from './services/geminiService';
import { AggregateMetrics, DailyMetric, Platform, AnalysisState } from './types';
import { useTheme } from './ThemeContext';

// Mock Data Generator
const generateMockData = (days: number, platform: Platform): DailyMetric[] => {
  const data: DailyMetric[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const baseReach = platform === 'facebook' ? 2000 : platform === 'instagram' ? 1200 : 3200;
    const baseEngage = platform === 'facebook' ? 150 : platform === 'instagram' ? 300 : 450;
    const randomFactor = Math.random() * 0.4 + 0.8;
    const trendFactor = 1 + (days - i) * 0.01;
    
    data.push({
      date: date.toISOString().split('T')[0],
      reach: Math.floor(baseReach * randomFactor * trendFactor),
      engagement: Math.floor(baseEngage * randomFactor * trendFactor),
      likes: Math.floor(baseEngage * 0.7 * randomFactor),
      shares: Math.floor(baseEngage * 0.1 * randomFactor),
      comments: Math.floor(baseEngage * 0.2 * randomFactor),
    });
  }
  return data;
};

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [chartData, setChartData] = useState<DailyMetric[]>([]);
  const [isRealData, setIsRealData] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const [aggregates, setAggregates] = useState<AggregateMetrics>({
    totalReach: 0,
    totalEngagement: 0,
    totalFollowers: 0,
    engagementRate: 0,
    topPostType: 'Video',
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    groundingUrls: [],
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let data: DailyMetric[] | null = null;

      if (platform === 'facebook' || platform === 'all') {
        try {
          const fbData = await fetchRealFacebookData(dateRange.start, dateRange.end);
          if (fbData && fbData.length) {
            data = fbData;
            setIsRealData(true);
          }
        } catch {
          console.warn("Fetch failed, using mock data");
        }
      }

      if (!data) data = generateMockData(diffDays, platform);
      setChartData(data);

      const totalReach = data.reduce((a, c) => a + c.reach, 0);
      const totalEngagement = data.reduce((a, c) => a + c.engagement, 0);
      const totalFollowers = platform === 'facebook' ? 45200 : platform === 'instagram' ? 12800 : 58000;

      setAggregates({
        totalReach,
        totalEngagement,
        totalFollowers,
        engagementRate: totalReach > 0 ? parseFloat(((totalEngagement / totalReach) * 100).toFixed(2)) : 0,
        topPostType: platform === 'instagram' ? 'Reels' : 'Photo Album',
      });

      setAnalysisState(prev => ({ ...prev, result: null, error: null, groundingUrls: [] }));
      setIsDataLoading(false);
    };

    loadData();
  }, [platform, dateRange, refreshKey]);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const handleAnalyze = async () => {
    setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { text, urls } = await analyzeSocialInsights(aggregates, platform, dateRange.start, dateRange.end);
      setAnalysisState({ isLoading: false, result: text, groundingUrls: urls, error: null });
    } catch (err: any) {
      setAnalysisState(prev => ({ ...prev, isLoading: false, error: err.message || "Failed to analyze." }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
              <LayoutDashboard className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Walailak Channel Insights</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">{isRealData ? 'Live Data' : 'Simulated Data'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
             <div className="hidden md:flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              {(['all', 'facebook', 'instagram'] as Platform[]).map((p: Platform) => (
                <button 
                  key={p} 
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${platform === p ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:shadow-md transition-all focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isDataLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-70 shadow-sm"
            >
              <RefreshCw size={16} className={isDataLoading ? "animate-spin" : ""}/> Refresh
            </button>
             <button className="md:hidden p-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300">
               <Menu size={20} />
             </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Reach" value={aggregates.totalReach.toLocaleString()} icon={<Users size={20} className="text-indigo-600 dark:text-indigo-400"/>}/>
          <StatCard title="Engagement" value={aggregates.totalEngagement.toLocaleString()} icon={<MessageCircle size={20} className="text-emerald-500 dark:text-emerald-400"/>}/>
          <StatCard title="Followers" value={aggregates.totalFollowers.toLocaleString()} icon={<Share2 size={20} className="text-teal-500 dark:text-teal-400"/>}/>
          <StatCard title="Engagement Rate" value={`${aggregates.engagementRate}%`} icon={<BarChart3 size={20} className="text-orange-500 dark:text-orange-400"/>}/>
        </section>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-100 dark:border-slate-700 h-[350px] flex flex-col transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Performance Trends</h2>
                <div className="text-sm text-slate-500 dark:text-slate-400">Last 30 days</div>
              </div>
              <div className="flex-1 min-h-0">
                <TrendChart data={chartData} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-100 dark:border-slate-700 h-[300px] flex flex-col transition-all duration-200">
               <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Engagement Breakdown</h2>
                <div className="text-sm text-slate-500 dark:text-slate-400">Recent 7 days</div>
              </div>
              <div className="flex-1 min-h-0">
                <BreakdownChart data={chartData.slice(-7)} />
              </div>
            </div>

            <div className="h-full">
                <InsightPanel isLoading={analysisState.isLoading} analysis={analysisState.result} urls={analysisState.groundingUrls} error={analysisState.error} onAnalyze={handleAnalyze}/>
            </div>
          </main>
          <aside className="lg:col-span-1 space-y-6 sticky top-20">
            <ChatInterface metrics={aggregates} platform={platform} dateRange={dateRange}/>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 border border-slate-100 dark:border-slate-700">
              <div className="text-xs text-center text-slate-400 dark:text-slate-500">
                 © {new Date().getFullYear()} Walailak Channel
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;