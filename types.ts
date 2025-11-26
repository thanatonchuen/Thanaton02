import React from 'react';

export type Platform = 'all' | 'facebook' | 'instagram';

export interface DailyMetric {
  date: string;
  reach: number;
  engagement: number;
  likes: number;
  shares: number;
  comments: number;
}

export interface AggregateMetrics {
  totalReach: number;
  totalEngagement: number;
  totalFollowers: number;
  engagementRate: number;
  topPostType: string;
}

export interface UrlItem {
  url: string;
  title?: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: string | null;
  groundingUrls: UrlItem[];
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}