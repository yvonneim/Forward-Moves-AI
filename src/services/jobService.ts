import { GoogleGenAI, Type } from "@google/genai";
import { Job, SWOTAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const searchJobs = async (query: string = "AI and IT job openings in USA"): Promise<Job[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the most recent AI and IT-related job openings across the USA, specifically from the week of March 16-20, 2026. 
    Focus on real, current listings from major tech employers and those currently hiring at scale, such as:
    - Verizon (National)
    - Amazon (National)
    - Google (National)
    - Microsoft (National)
    - Meta (National)
    - Major HealthTech, FinTech, and Enterprise IT firms
    
    Search Query: ${query}
    
    Ensure the results are real and include valid URLs to the job postings AND the company's general career page URL.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            companyUrl: { type: Type.STRING, description: "The URL of the company's general career page" },
            location: { type: Type.STRING },
            salary: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            postedDate: { type: Type.STRING },
            description: { type: Type.STRING },
            url: { type: Type.STRING },
          },
          required: ["id", "title", "company", "companyUrl", "location", "postedDate", "url"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse job search results", e);
    return [];
  }
};

export const generateSWOT = async (job: Job): Promise<SWOTAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Perform a SWOT analysis for this job opening:
    Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Tech Stack: ${job.techStack?.join(", ")}
    Description: ${job.description}
    
    Provide a professional analysis of Strengths, Weaknesses, Opportunities, and Threats for a candidate applying to this role.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse SWOT analysis", e);
    return { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  }
};
