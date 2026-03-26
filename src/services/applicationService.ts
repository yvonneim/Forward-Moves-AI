import { GoogleGenAI, Type } from "@google/genai";
import { Job, InterviewPrep, CoverLetter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateInterviewPrep = async (job: Job): Promise<InterviewPrep> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate an interview preparation guide for the role of "${job.title}" at "${job.company}".
    
    Job Description:
    ${job.description}
    
    Provide 5 likely interview questions, suggested answers, and why they are asking each question. Also include a summary of the company culture and 3 pieces of strategic advice for the interview.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                suggestedAnswer: { type: Type.STRING },
                whyTheyAsk: { type: Type.STRING },
              },
              required: ["question", "suggestedAnswer", "whyTheyAsk"],
            },
          },
          companyCulture: { type: Type.STRING },
          strategicAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["questions", "companyCulture", "strategicAdvice"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateCoverLetter = async (resumeText: string, job: Job): Promise<CoverLetter> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Draft a highly personalized and compelling cover letter for the role of "${job.title}" at "${job.company}" based on the following resume.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${job.description}
    
    The cover letter should be professional, highlight specific achievements from the resume that match the job requirements, and show genuine interest in the company.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          keyPointsHighlighted: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["content", "keyPointsHighlighted"],
      },
    },
  });

  return JSON.parse(response.text);
};
