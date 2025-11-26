import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define the structure for URL items returned by grounding
interface UrlItem {
  url: string;
  title?: string;
}

// Define the success response structure
interface AnalysisResponse {
  text: string;
  urls: UrlItem[];
}

// Define the error response structure
interface ErrorResponse {
  error: string;
}

// Define the expected request body structure
interface AnalyzeRequestBody {
  metrics: {
    totalReach: number;
    totalEngagement: number;
    engagementRate: number;
    topPostType: string;
  };
  platform: string;
  startDate: string;
  endDate: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' } as ErrorResponse);
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error: Missing API Key' } as ErrorResponse);
  }

  try {
    // Type assertion for the request body
    const { metrics, platform, startDate, endDate } = request.body as AnalyzeRequestBody;

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

    const urls: UrlItem[] = [];
    
    // Safely access and iterate grounding chunks with type checking
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          urls.push({
            url: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri
          });
        }
      });
    }

    // Deduplicate URLs based on the unique URL string
    const uniqueUrls = Array.from(new Map(urls.map(item => [item.url, item])).values());

    // Construct the type-safe response
    const responseData: AnalysisResponse = { 
      text: result.text || "Unable to generate analysis.",
      urls: uniqueUrls
    };

    return response.status(200).json(responseData);

  } catch (error: any) {
    console.error("API Analysis Error:", error);
    const errorResponse: ErrorResponse = { 
      error: error.message || 'Failed to process analysis' 
    };
    return response.status(500).json(errorResponse);
  }
}