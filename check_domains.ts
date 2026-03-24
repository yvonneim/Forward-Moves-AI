import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function checkDomains() {
  const domains = [
    "forwardmoves.ai",
    "forwardmovesusa.com",
    "forwardmoves-scout.com",
    "aiscout.us",
    "forwardmoves.io",
    "moves.ai",
    "forwardmoves.app"
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Check if the following domains are likely available or currently active websites: ${domains.join(", ")}. 
    Provide a summary of which ones appear to be taken and which ones might be available for purchase.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log(response.text);
}

checkDomains();
