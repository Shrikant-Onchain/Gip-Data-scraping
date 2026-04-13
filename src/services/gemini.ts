import { GoogleGenAI, Type } from "@google/genai";

const api_gemini= "AIzaSyCytjhLI5qDIQsEIERHqYq36q-iKyYOUq8"
const ai = new GoogleGenAI({ apiKey: "AIzaSyCytjhLI5qDIQsEIERHqYq36q-iKyYOUq8" });

export interface Action {
  timestamp: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
}

export interface VideoAnalysis {
  actions: Action[];
  summary: string;
}

export async function analyzeVideo(file: File): Promise<VideoAnalysis> {
  const base64Data = await fileToBase64(file);
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: `Analyze this video or GIF and provide a detailed script of all actions performed. 
            Format the output as a JSON object with two main fields:
            1. "actions": An array of objects, each with "timestamp" (e.g., "0:05"), "description" (what happened), and "importance" ("low", "medium", or "high").
            2. "summary": A concise paragraph summarizing the entire content.
            
            Be precise with timestamps and descriptive with actions.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                description: { type: Type.STRING },
                importance: { type: Type.STRING, enum: ["low", "medium", "high"] },
              },
              required: ["timestamp", "description", "importance"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["actions", "summary"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as VideoAnalysis;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:video/mp4;base64, prefix
      resolve(base64String.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}
