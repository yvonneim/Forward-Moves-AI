import { GoogleGenAI, Type } from "@google/genai";
import { Job, ResumeMatch, RevisedResume } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs)
    ),
  ]);
};

export const matchResumeToJob = async (resumeText: string, job: Job): Promise<ResumeMatch> => {
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following resume against the job description for "${job.title}" at "${job.company}".
        
        Resume:
        ${resumeText.slice(0, 10000)}
        
        Job Description:
        ${job.description}
        
        Provide a match score (0-100), a list of matching skills, a list of missing skills, a short summary of the fit, and actionable tips for the application.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "matchingSkills", "missingSkills", "summary", "tips"],
          },
        },
      }),
      60000 // 60 second timeout
    );

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error in matchResumeToJob:", error);
    throw error;
  }
};

export const generateMarketMatchSummary = async (resumeText: string, jobs: Job[]): Promise<{ summary: string; topMatches: string[]; alignmentScore: number }> => {
  try {
    const jobTitles = jobs.slice(0, 10).map(j => `${j.title} at ${j.company}`).join(", ");
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this resume against the current job market listings.
        
        Resume:
        ${resumeText.slice(0, 5000)}
        
        Current Job Listings:
        ${jobTitles}
        
        Provide a short summary (2 sentences) of how this profile aligns with the current market, a list of the top 3 job titles that match best, and an overall alignment score (0-100).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              topMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
              alignmentScore: { type: Type.NUMBER },
            },
            required: ["summary", "topMatches", "alignmentScore"],
          },
        },
      }),
      60000
    );

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error in generateMarketMatchSummary:", error);
    return { summary: "We're analyzing your profile against the current market...", topMatches: [], alignmentScore: 0 };
  }
};

export const reviseResume = async (resumeText: string, job: Job): Promise<RevisedResume> => {
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Revise and update the following resume based on the job description for "${job.title}" at "${job.company}".
        
        Resume:
        ${resumeText.slice(0, 10000)}
        
        Job Description:
        ${job.description}
        
        Instructions:
        1.  Maintain the original structure but update bullet points to better align with the job's key requirements.
        2.  Incorporate relevant keywords from the job description.
        3.  Highlight specific achievements that match the job's responsibilities.
        4.  Provide a list of specific changes made and the reasoning behind them.
        5.  Suggest additional keywords to include in the final application.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "The full revised resume text in Markdown format" },
              revisions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    change: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ["section", "change", "reason"],
                },
              },
              suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["content", "revisions", "suggestedKeywords"],
          },
        },
      }),
      90000 // 90 second timeout for revision as it's a larger task
    );

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error in reviseResume:", error);
    throw error;
  }
};
