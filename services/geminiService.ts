
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are 'CrisisBot', an AI assistant for fire emergency reporting in Dhaka, Bangladesh. Your purpose is to:
1. Help users report fire emergencies quickly
2. Provide immediate safety instructions in both Bangla and English
3. Assess fire severity based on descriptions
4. Guide evacuation procedures
5. Offer first aid information for burns

- Prioritize safety above all else
- Use clear, simple language
- Be supportive and calm in your tone
- Respond in the same language as the user (Bangla or English)`;

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

export const analyzeSeverity = async (description: string): Promise<'minor' | 'major' | 'critical'> => {
  try {
    const prompt = `Analyze this fire emergency description and classify it as "minor", "major", or "critical". 
    
ONLY respond with one word: minor, major, or critical.

Classification criteria:
- MINOR: Small fire, contained area, no people at risk, manageable with extinguisher
- MAJOR: Spreading fire, structural damage, people may be at risk, needs fire service
- CRITICAL: Large fire, people trapped, imminent collapse, life-threatening, multiple floors

Description: ${description}

Response (one word only):`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    const result = response.text.trim().toLowerCase();
    
    if (result.includes('critical')) return 'critical';
    if (result.includes('major')) return 'major';
    return 'minor';
  } catch (error) {
    console.error("Error analyzing severity:", error);
    // Default to major if analysis fails (safer)
    return 'major';
  }
};

export const analyzeFireReport = async (
  description: string,
  severity: string,
  location: string,
  language: 'en' | 'bn'
): Promise<string> => {
  try {
    const languageInstruction = language === 'bn' 
      ? 'Respond in Bangla (বাংলা)' 
      : 'Respond in English';

    const prompt = `${languageInstruction}

A fire emergency has been reported with the following details:

SEVERITY: ${severity.toUpperCase()}
LOCATION: ${location}
DESCRIPTION: ${description}

As CrisisBot, provide:
1. IMMEDIATE SAFETY ACTIONS (2-3 critical steps)
2. EVACUATION GUIDANCE (specific to this situation)
3. WHAT TO EXPECT (fire service response time, what they'll do)
4. IMPORTANT WARNINGS (what NOT to do)

Keep it concise, actionable, and calm. Use bullet points. Maximum 200 words.`;

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
    console.error("Error analyzing fire report:", error);
    if (language === 'bn') {
      return `দুঃখিত, রিপোর্ট বিশ্লেষণ করতে ত্রুটি হয়েছে। অবিলম্বে ফায়ার সার্ভিস (১৯৯) কল করুন এবং নিরাপদ স্থানে সরে যান।`;
    }
    return `Sorry, error analyzing report. Please call Fire Service (199) immediately and move to safety.`;
  }
};
