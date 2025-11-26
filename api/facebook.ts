
export default async function handler(request, response) {
  // Use the environment variable, or fallback to the provided token if not set (for demo purposes, though env var is recommended)
  // You should set FACEBOOK_ACCESS_TOKEN in Vercel.
  const token = process.env.FACEBOOK_ACCESS_TOKEN || "EAATugga4UzEBQIpL92baPizSOwnGpaLw3GS0ujDZCBclCIuuQMGrnOnqrPFIbB0yO1N8aH5tR8Qyb1pCzbpW8glJCmgx4snfXE8TWlqzXqixAXhpyQ5zQ463xvybchRftMjw9xDpGJNJdeflMVJbzG36IK2nBP0VPSSwcxm60BBRRtHZCo3zjiCqhuisjVJ1CofS8JOIvxrbd2ARX8y6hhQhe9jrZAgJZBSrfku5H4BBMZAR5mUld8vSr7EsZD";
  
  if (!token) {
    return response.status(500).json({ error: 'Server configuration error: Missing Facebook Token' });
  }

  try {
    const { startDate, endDate } = request.query;

    // 1. Get the Page ID
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
    
    if (!accountsRes.ok) throw new Error("Failed to fetch accounts");
    
    const accountsData = await accountsRes.json();
    const page = accountsData.data.find((p) => 
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
