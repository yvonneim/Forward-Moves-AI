import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants/prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ScoutMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
}

export const chatWithScout = async (messages: ScoutMessage[]): Promise<ScoutMessage> => {
  const lastMessage = messages[messages.length - 1].content;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `User Query: ${lastMessage}` }]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + `\n\nYou are the "AI Career Scout" for Forward Moves. 
        Your goal is to help job seekers navigate the modern job market using real-time information.
        While we have a focus on AI integration, you cover ALL careers and industries.
        Use Google Search to find current job trends, company news, and career advice across any field the user asks about.
        Be professional, encouraging, and data-driven.`,
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
    title: chunk.web?.title || "Source",
    url: chunk.web?.uri || ""
  })).filter(s => s.url) || [];

  return {
    role: 'assistant',
    content: response.text || "I'm sorry, I couldn't find any information on that.",
    sources: sources.slice(0, 5)
  };
};
