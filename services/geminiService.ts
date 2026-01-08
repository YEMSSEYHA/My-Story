
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const analyzeStory = async (storyText: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this story (in Khmer): ${storyText}`,
    config: {
      systemInstruction: "You are a professional literary critic and legal expert. Provide an analysis of the themes of IT vs Law, the character development of Seha and Kanhchana, and the overall moral. Your response must be in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moral: { type: Type.STRING, description: "The central moral of the story." },
          characterAnalysis: {
            type: Type.OBJECT,
            properties: {
              seha: { type: Type.STRING },
              kanhchana: { type: Type.STRING }
            },
            required: ["seha", "kanhchana"]
          },
          itVsLaw: { type: Type.STRING, description: "Comparison between technical skills and legal/psychological knowledge in the story." }
        },
        required: ["moral", "characterAnalysis", "itVsLaw"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
