import { GoogleGenAI } from "@google/genai";

async function generateHeroImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "Generate a 4K, professional landing page background for 'USA Job Scout: Forward Moves.' Concept: A minimalist, futuristic glass bridge connecting a traditional office environment to a vibrant, glowing digital cityscape representing the AI career frontier. Style: Photorealistic with a cinematic shallow depth of field. Lighting: Golden hour 'warm' light hitting the bridge, contrasting with 'cool' neon blues in the distance. Constraint: Do not include any human figures or text.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export { generateHeroImage };
