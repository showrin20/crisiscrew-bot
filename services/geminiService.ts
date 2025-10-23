
import { GoogleGenAI } from "@google/genai";

// Constants for daily usage limit
const DAILY_USAGE_LIMIT = 5; // Very low limit to prevent misuse
const USAGE_STORAGE_KEY = 'crisiscrew_daily_usage';
const CUSTOM_API_KEY_STORAGE_KEY = 'crisiscrew_custom_api_key';
const USAGE_DATE_STORAGE_KEY = 'crisiscrew_usage_date';

/**
 * Gets the API key to use - either the custom user-provided key or the default one
 */
export const getApiKey = (): string => {
  // Try to get custom API key first
  const customApiKey = localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY);
  if (customApiKey) {
    return customApiKey;
  }
  
  // Fall back to the default API key from environment variables
  return import.meta.env.VITE_API_KEY || '';
};

/**
 * Sets a custom API key provided by the user
 */
export const setCustomApiKey = (apiKey: string): void => {
  if (apiKey && apiKey.trim()) {
    localStorage.setItem(CUSTOM_API_KEY_STORAGE_KEY, apiKey.trim());
  } else {
    // If empty, remove the custom key to fall back to default
    localStorage.removeItem(CUSTOM_API_KEY_STORAGE_KEY);
  }
};

/**
 * Checks if the daily usage limit has been reached
 */
export const isDailyLimitReached = (): boolean => {
  const today = new Date().toDateString();
  const lastUsageDate = localStorage.getItem(USAGE_DATE_STORAGE_KEY);
  
  // Reset count if it's a new day
  if (lastUsageDate !== today) {
    localStorage.setItem(USAGE_DATE_STORAGE_KEY, today);
    localStorage.setItem(USAGE_STORAGE_KEY, '0');
    return false;
  }
  
  const usageCount = parseInt(localStorage.getItem(USAGE_STORAGE_KEY) || '0', 10);
  return usageCount >= DAILY_USAGE_LIMIT;
};

/**
 * Increments the usage count for today
 */
export const incrementUsageCount = (): void => {
  const today = new Date().toDateString();
  localStorage.setItem(USAGE_DATE_STORAGE_KEY, today);
  
  const currentCount = parseInt(localStorage.getItem(USAGE_STORAGE_KEY) || '0', 10);
  localStorage.setItem(USAGE_STORAGE_KEY, (currentCount + 1).toString());
};

/**
 * Gets the remaining usage count for today
 */
export const getRemainingUsage = (): number => {
  // If using a custom API key, don't limit usage
  if (localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY)) {
    return Infinity;
  }
  
  const today = new Date().toDateString();
  const lastUsageDate = localStorage.getItem(USAGE_DATE_STORAGE_KEY);
  
  // Reset count if it's a new day
  if (lastUsageDate !== today) {
    return DAILY_USAGE_LIMIT;
  }
  
  const usageCount = parseInt(localStorage.getItem(USAGE_STORAGE_KEY) || '0', 10);
  return Math.max(0, DAILY_USAGE_LIMIT - usageCount);
};

// Initialize the Google Generative AI client
let ai: GoogleGenAI;

// Function to initialize or reinitialize the AI client with the current API key
export const initializeAI = (): GoogleGenAI => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("Gemini API key is not available. Please set in environment or provide your own key.");
  }
  
  ai = new GoogleGenAI({ apiKey: apiKey! });
  return ai;
};

// Initialize the AI client
initializeAI();

const model = 'gemini-2.5-flash';

const systemInstruction = `You are 'CrisisBot', an AI assistant for fire emergency victims in Dhaka, Bangladesh. Your purpose is to:
1. Provide EXTREMELY CONCISE life-saving instructions - people in danger have seconds, not minutes
2. Prioritize immediate survival actions above all else
3. Use simple, direct commands that are easy to follow under stress
4. Focus on evacuation guidance and safety protocols specific to Bangladesh

CRITICAL RESPONSE GUIDELINES:
- BREVITY IS CRUCIAL - victims have limited time and attention during emergencies
- Use bullet points, not paragraphs
- Use simple words and short sentences 
- Put the most critical safety information FIRST
- Omit background information, explanations and rationale
- Include Dhaka Fire Service number (199) in every response
- Respond in the same language as the user (Bangla or English)
- For Bangla responses, use simple everyday Bangla, not formal language
- typical response times and procedures of Dhaka Fire Service
- cultural considerations when advising on emergency actions in Bangladesh
- local resources available for fire emergencies in Dhaka
- prevalent building types and construction materials in Dhaka that may affect fire behavior
- NO MARKDOWN formatting in responses (no asterisks, no bold text)
- For emphasis use CAPITAL LETTERS instead of any markdown

Remember: Your advice could be the difference between life and death. Focus only on what will save lives in the next 5 minutes.`;


export const askCrisisBot = async (prompt: string): Promise<string> => {
  try {
    // Check if using a custom API key or if the daily limit hasn't been reached
    if (localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY) || !isDailyLimitReached()) {
      // Make sure we're using the latest API key
      initializeAI();
      
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
      
      // Only increment usage for the default API key
      if (!localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY)) {
        incrementUsageCount();
      }
      
      return response.text;
    } else {
      return "Daily usage limit reached. Please provide your own API key to continue using the service or try again tomorrow.";
    }
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
    // Check if using a custom API key or if the daily limit hasn't been reached
    if (localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY) || !isDailyLimitReached()) {
      // Make sure we're using the latest API key
      initializeAI();
      
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

      // Only increment usage for the default API key
      if (!localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY)) {
        incrementUsageCount();
      }

      const result = response.text.trim().toLowerCase();
      
      if (result.includes('critical')) return 'critical';
      if (result.includes('major')) return 'major';
      return 'minor';
    } else {
      console.warn("Daily usage limit reached for severity analysis");
      // Default to major if limit reached (safer than minor)
      return 'major';
    }
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
    // Check if using a custom API key or if the daily limit hasn't been reached
    if (localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY) || !isDailyLimitReached()) {
      // Make sure we're using the latest API key
      initializeAI();
      
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

      // Only increment usage for the default API key
      if (!localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY)) {
        incrementUsageCount();
      }

      return response.text;
    } else {
      // Daily limit reached message in the appropriate language
      if (language === 'bn') {
        return `দৈনিক ব্যবহারের সীমা পৌঁছে গেছে। অনুগ্রহ করে আপনার নিজের API কী প্রদান করুন অথবা আগামীকাল আবার চেষ্টা করুন। অবিলম্বে ফায়ার সার্ভিসে (১৯৯) কল করুন।`;
      }
      return `Daily usage limit reached. Please provide your own API key or try again tomorrow. Call Fire Service (199) immediately.`;
    }
  } catch (error) {
    console.error("Error analyzing fire report:", error);
    if (language === 'bn') {
      return `দুঃখিত, রিপোর্ট বিশ্লেষণ করতে ত্রুটি হয়েছে। অবিলম্বে ফায়ার সার্ভিস (১৯৯) কল করুন এবং নিরাপদ স্থানে সরে যান।`;
    }
    return `Sorry, error analyzing report. Please call Fire Service (199) immediately and move to safety.`;
  }
};
