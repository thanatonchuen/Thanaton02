import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, MessageCircle, Share2, BarChart3, Menu, RefreshCw } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { InsightPanel } from './components/InsightPanel';
import { ChatInterface } from './components/ChatInterface';
import TrendChart from './charts/TrendChart';
import BreakdownChart from './charts/BreakdownChart';
import { fetchRealFacebookData } from './services/facebookService';
import { analyzeSocialInsights } from './services/geminiService';
import { AggregateMetrics, DailyMetric, Platform, AnalysisState } from './types';

// Mock Data Generator
const generateMockData = (days: number, platform: Platform): DailyMetric[] => {
  const data: DailyMetric[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Base random multipliers based on platform
    const baseReach = platform === 'facebook' ? 2000 : platform === 'instagram' ? 1200 : 3200;
    const baseEngage = platform === 'facebook' ? 150 : platform === 'instagram' ? 300 : 450;
    
    const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    const trendFactor = 1 + (days - i) * 0.01; // Slight upward trend
    
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
  // --- State ---
  const [platform, setPlatform] = useState<Platform>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Data State
  const [chartData, setChartData] = useState<DailyMetric[]>([]);
  const [isRealData, setIsRealData] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  // Refresh trigger key
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const [aggregates, setAggregates] = useState<AggregateMetrics>({
    totalReach: 0, 
    totalEngagement: 0, 
    totalFollowers: 0, 
    engagementRate: 0,
    topPostType: 'Video'
  });

  // AI Analysis State
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    groundingUrls: [],
    error: null
  });

  // --- Effects ---

  // Fetch Data when deps change
  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      
      // Calculate days difference for mock generator
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let data: DailyMetric[] | null = null;

      // Attempt to fetch real data if platform is facebook or all
      if (platform === 'facebook' || platform === 'all') {
        try {
           const fbData = await fetchRealFacebookData(dateRange.start, dateRange.end);
           
           if (fbData && fbData.length > 0) {
             data = fbData;
             setIsRealData(true);
           }
        } catch (err) {
          console.warn("Falling back to mock data due to fetch error");
        }
      }

      // Fallback to mock data if fetch failed or using Instagram
      if (!data) {
        data = generateMockData(diffDays, platform);
        setIsRealData(false);
      }

      setChartData(data);

      // Calculate aggregates
      const totalReach = data.reduce((acc, curr) => acc + curr.reach, 0);
      const totalEngagement = data.reduce((acc, curr) => acc + curr.engagement, 0);
      const totalFollowers = platform === 'facebook' ? 45200 : platform === 'instagram' ? 12800 : 58000;
      
      setAggregates({
        totalReach,
        totalEngagement,
        totalFollowers,
        engagementRate: totalReach > 0 ? parseFloat(((totalEngagement / totalReach) * 100).toFixed(2)) : 0,
        topPostType: platform === 'instagram' ? 'Reels' : 'Photo Album'
      });

      // Reset analysis when data context changes (but not on simple refresh, optional)
      setAnalysisState(prev => ({ ...prev, result: null, error: null, groundingUrls: [] }));
      setIsDataLoading(false);
    };

    loadData();
  }, [platform, dateRange, refreshKey]);

  // --- Handlers ---

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAnalyze = async () => {
    setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { text, urls } = await analyzeSocialInsights(
        aggregates,
        platform,
        dateRange.start,
        dateRange.end
      );
      setAnalysisState({
        isLoading: false,
        result: text,
        groundingUrls: urls,
        error: null
      });
    } catch (err: any) {
      setAnalysisState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "Failed to analyze." 
      }));
    }
  };

  const palette = {
    bg: 'bg-slate-50',
    card: 'bg-white',
    muted: 'text-slate-500',
    accent: 'text-indigo-600',
  };

  return (
    <div className={`${palette.bg} min-h-screen text-slate-900`}> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 shadow-md">
              <LayoutDashboard className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight">Walailak Channel Insights</h1>
              <p className="text-sm text-slate-500">
                Clean minimal dashboard · {isRealData ? 'Live Data' : 'Simulated Data'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-white border border-slate-200 rounded-lg p-1">
                {(['all', 'facebook', 'instagram'] as Platform[]).map(p => (
                    <button 
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${platform === p ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm shadow-sm hover:shadow-md">
              <Menu size={16} />
              Menu
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">WC</div>
            </div>
          </div>
        </header>

        {/* Top stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Reach" 
            value={aggregates.totalReach.toLocaleString()} 
            change={5.2} 
            icon={<Users size={20} className="text-indigo-600" />} 
          />
          <StatCard 
            title="Engagement" 
            value={aggregates.totalEngagement.toLocaleString()} 
            change={-1.1} 
            icon={<MessageCircle size={20} className="text-emerald-500" />} 
          />
          <StatCard 
            title="Followers" 
            value={aggregates.totalFollowers.toLocaleString()} 
            change={0.9} 
            icon={<Share2 size={20} className="text-teal-500" />} 
          />
          <StatCard 
            title="Engagement Rate" 
            value={`${aggregates.engagementRate}%`} 
            change={0.4} 
            icon={<BarChart3 size={20} className="text-orange-500" />} 
          />
        </section>

        {/* Main layout: left content + right sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <main className="lg:col-span-3 space-y-6">
            {/* Performance Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Performance Trends</h2>
                <div className="text-sm text-slate-500">Last 30 days</div>
              </div>

              <div className="h-72">
                <TrendChart data={chartData} />
              </div>
            </div>

            {/* Engagement breakdown */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Engagement Breakdown</h2>
                <div className="text-sm text-slate-500">Recent 7 days</div>
              </div>
              <div className="h-52">
                <BreakdownChart data={chartData.slice(-7)} />
              </div>
            </div>

            {/* Insight panel */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <InsightPanel 
                isLoading={analysisState.isLoading} 
                analysis={analysisState.result} 
                urls={analysisState.groundingUrls} 
                error={analysisState.error} 
                onAnalyze={handleAnalyze} 
              />
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            {/* Chat Interface */}
            <div className="sticky top-20 bg-white rounded-2xl shadow-md p-4 border border-slate-100">
              <ChatInterface metrics={aggregates} platform={platform} dateRange={dateRange} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100">
              <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleRefresh}
                  disabled={isDataLoading}
                  className="w-full text-left px-3 py-2 rounded-md bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  <RefreshCw size={16} className={isDataLoading ? "animate-spin" : ""} />
                  Refresh Data
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Export CSV</button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Settings</button>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 text-sm text-slate-600">
              <div className="font-semibold mb-1">About</div>
              <div className="text-xs">Walailak Channel Insights · Minimal redesign · Built for clarity</div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-400">© {new Date().getFullYear()} Walailak Channel · Made with care</footer>
      </div>
    </div>
  );
};

export default App;