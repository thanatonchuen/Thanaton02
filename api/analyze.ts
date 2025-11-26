
import { GoogleGenAI } from '@google/genai';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const { metrics, platform, startDate, endDate } = request.body;

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze the following social media performance for "Walailak Channel" (${platform === 'all' ? 'Facebook & Instagram' : platform}) 
      from ${startDate} to ${endDate}.
      
      Metrics:
      - Total Reach: ${metrics.totalReach}
      - Total Engagement: ${metrics.totalEngagement}
      - Engagement Rate: ${metrics.engagementRate}%
      - Top Content Format: ${metrics.topPostType}
      
      Task:
      1. Provide a brief performance summary (in Thai).
      2. "Possibility Analysis" (วิเคราะห์ความเป็นไปได้): 
         - Search for current trending topics in Thailand right now (news, education, viral trends).
         - Suggest 3 concrete content ideas that connect Walailak Channel's educational/university brand with these real-time trends.
         - Estimate why these would succeed based on the current engagement rate.
         
      Keep the tone professional yet encouraging. Use Thai language for the response.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7
      }
    });

    const urls = [];
    if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      result.candidates[0].groundingMetadata.groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri) urls.push(chunk.web.uri);
      });
    }

    return response.status(200).json({ 
      text: result.text || "Unable to generate analysis.",
      urls: Array.from(new Set(urls))
    });

  } catch (error) {
    console.error("API Analysis Error:", error);
    return response.status(500).json({ error: 'Failed to process analysis' });
  }
}
