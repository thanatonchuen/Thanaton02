import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequestBody {
  message: string;
  history: ChatHistoryItem[];
  context: {
    metrics: any;
    platform: string;
    dateRange: { start: string; end: string };
  };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const { message, history, context } = request.body as ChatRequestBody;

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct system instruction with context
    const systemInstruction = `
      You are an expert Social Media Data Consultant for "Walailak Channel".
      Current Dashboard Context:
      - Platform: ${context.platform}
      - Date Range: ${context.dateRange.start} to ${context.dateRange.end}
      - Reach: ${context.metrics.totalReach}
      - Engagement: ${context.metrics.totalEngagement}
      - Engagement Rate: ${context.metrics.engagementRate}%
      
      Your goal is to answer user questions about this data, suggest strategies, and explain marketing concepts.
      Answer in Thai unless asked otherwise. Be concise and data-driven.
    `;

    const contents = [
      ...history.map((msg: ChatHistoryItem) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    return response.status(200).json({ 
      text: result.text || "I am unable to answer right now."
    });

  } catch (error) {
    console.error("API Chat Error:", error);
    return response.status(500).json({ error: 'Failed to process chat' });
  }
}