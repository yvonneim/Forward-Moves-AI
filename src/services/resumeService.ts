import { GoogleGenAI, Type } from "@google/genai";
import { Job, ResumeMatch, RevisedResume } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const matchResumeToJob = async (resumeText: string, job: Job): Promise<ResumeMatch> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following resume against the job description for "${job.title}" at "${job.company}".
    
    Resume:
    ${resumeText}
    
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
  });

  return JSON.parse(response.text);
};

export const reviseResume = async (resumeText: string, job: Job): Promise<RevisedResume> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Revise and update the following resume based on the job description for "${job.title}" at "${job.company}".
    
    Resume:
    ${resumeText}
    
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
  });

  return JSON.parse(response.text);
};
