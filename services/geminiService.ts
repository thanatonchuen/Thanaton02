import { AggregateMetrics, Platform, ChatMessage, UrlItem } from "../types";

/**
 * Analyzes social media metrics by calling the server-side API.
 */
export const analyzeSocialInsights = async (
  metrics: AggregateMetrics,
  platform: Platform,
  startDate: string,
  endDate: string
): Promise<{ text: string, urls: UrlItem[] }> => {
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrics, platform, startDate, endDate })
    });

    if (!response.ok) {
      throw new Error('Analysis request failed');
    }

    const data = await response.json();
    return {
      text: data.text,
      urls: data.urls || []
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze insights. Please try again.");
  }
};

/**
 * Sends a chat message to the server-side API.
 */
export const sendChatMessage = async (
  message: string,
  history: ChatMessage[],
  context: {
    metrics: AggregateMetrics,
    platform: Platform,
    dateRange: { start: string, end: string }
  }
): Promise<string> => {
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        history, 
        context 
      })
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("I'm having trouble connecting right now.");
  }
};