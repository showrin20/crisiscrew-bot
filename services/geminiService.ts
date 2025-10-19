
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are 'CrisisBot', an AI assistant for the CrisisCrew platform. Your purpose is to provide clear, concise, and accurate information related to fire safety, emergency response protocols, first aid, and crisis management. Your audience is trained community volunteers and first responders. 
- Prioritize safety above all else.
- Use clear, simple language.
- If a question is outside your scope of crisis response, politely state your purpose.
- Do not provide medical advice for which a licensed professional is required, but you can quote standard first aid procedures.
- Be supportive and calm in your tone.`;

export const askCrisisBot = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Sorry, I encountered an error: ${error.message}. Please check the console for more details. The API key might be missing or invalid.`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};
