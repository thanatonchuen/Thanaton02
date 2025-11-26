import { DailyMetric } from "../types";

interface FacebookDayItem {
  value: number;
  end_time: string;
}

interface FacebookInsightMetric {
  name: string;
  values: FacebookDayItem[];
}

/**
 * Fetches real Facebook Page Insights by calling the server-side API.
 */
export const fetchRealFacebookData = async (
  startDate: string, 
  endDate: string
): Promise<DailyMetric[] | null> => {
  try {
    const response = await fetch(`/api/facebook?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      console.warn("API fetch failed");
      return null;
    }

    const insightsData = await response.json();
    
    if (!insightsData.data || insightsData.data.length === 0) return null;

    // Process Data into DailyMetric[] with types
    const reachSeries: FacebookDayItem[] = insightsData.data.find((m: FacebookInsightMetric) => m.name === 'page_impressions_unique')?.values || [];
    const engagementSeries: FacebookDayItem[] = insightsData.data.find((m: FacebookInsightMetric) => m.name === 'page_post_engagements')?.values || [];

    const processedData: DailyMetric[] = reachSeries.map((dayItem: FacebookDayItem) => {
      const dateStr = dayItem.end_time.split('T')[0];
      
      const reach = dayItem.value || 0;
      const engagement = engagementSeries.find((d: FacebookDayItem) => d.end_time === dayItem.end_time)?.value || 0;
      
      const estimatedLikes = Math.floor(engagement * 0.85); 
      const estimatedShares = Math.floor(engagement * 0.10);
      const estimatedComments = Math.floor(engagement * 0.05);

      return {
        date: dateStr,
        reach,
        engagement,
        likes: estimatedLikes,
        shares: estimatedShares,
        comments: estimatedComments
      };
    });

    return processedData;

  } catch (error) {
    console.warn("Real Facebook data fetch failed. Falling back to mock data.", error);
    return null;
  }
};