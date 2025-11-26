import type { VercelRequest, VercelResponse } from '@vercel/node';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Use the environment variable, or fallback to the provided token if not set
  const token = process.env.FACEBOOK_ACCESS_TOKEN || "EAATugga4UzEBQIN8I5PesDXrmWebAGbbxbQc9coA9Js8yZBcc4z2iCQ3FK2gqCuA4dVrqJ17MbK3ZCMxqiuwGktDmZCQjvuwEZBD1gtkVDqgwSotrLy68bycgCljqh9LANaIBDpaw4LZAi9tRuubPLkpMPo1TTrFCpoMQ4GIEkhAxwQ14nuLk7OOgXND2JfSkQg1eeEer4o0xECFZCwtlnRbvhXG4DBw9Az4Tc1d7O22iwkTRnWjzVuGQZD";
  
  if (!token) {
    return response.status(500).json({ error: 'Server configuration error: Missing Facebook Token' });
  }

  try {
    const startDate = request.query.startDate as string;
    const endDate = request.query.endDate as string;

    if (!startDate || !endDate) {
       return response.status(400).json({ error: 'Missing required query parameters: startDate, endDate' });
    }

    // 1. Get the Page ID
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
    
    if (!accountsRes.ok) throw new Error("Failed to fetch accounts");
    
    const accountsData = await accountsRes.json();
    const page = accountsData.data.find((p: FacebookPage) => 
      p.name.toLowerCase().includes("walailak") || 
      p.name.toLowerCase().includes("channel")
    ) || accountsData.data[0];
    
    if (!page) {
      return response.status(404).json({ error: "No managed pages found." });
    }

    const pageId = page.id;
    const pageAccessToken = page.access_token; 

    // 2. Fetch Insights
    const metricList = "page_impressions_unique,page_post_engagements";
    const insightsUrl = `https://graph.facebook.com/v19.0/${pageId}/insights?metric=${metricList}&period=day&since=${startDate}&until=${endDate}&access_token=${pageAccessToken}`;
    
    const insightsRes = await fetch(insightsUrl);
    
    if (!insightsRes.ok) {
      throw new Error("Failed to fetch insights from Graph API");
    }
    
    const insightsData = await insightsRes.json();
    return response.status(200).json(insightsData);

  } catch (error) {
    console.error("Facebook API Error:", error);
    return response.status(500).json({ error: 'Failed to fetch Facebook data' });
  }
}