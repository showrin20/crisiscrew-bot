// Speech recognition service for web applications

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  isComplete: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string; // 'en-US', 'bn-BD', etc.
  continuous?: boolean;
  interimResults?: boolean;
}

// Check if browser supports speech recognition
const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Initialize speech recognition
const initSpeechRecognition = (options?: SpeechRecognitionOptions) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Speech recognition not supported in this browser');
  }

  const recognition = new SpeechRecognition();
  
  recognition.lang = options?.language || 'en-US';
  recognition.continuous = options?.continuous || false;
  recognition.interimResults = options?.interimResults || true;
  
  return recognition;
};

// Start listening for speech
export const startSpeechRecognition = (
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: Error) => void,
  options?: SpeechRecognitionOptions
): { stop: () => void } => {
  
  if (!isSpeechRecognitionSupported()) {
    onError(new Error('Speech recognition not supported in this browser'));
    return { stop: () => {} };
  }
  
  try {
    const recognition = initSpeechRecognition(options);
    
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      const isComplete = lastResult.isFinal;
      
      onResult({ transcript, isComplete });
    };
    
    recognition.onerror = (event) => {
      onError(new Error(`Speech recognition error: ${event.error}`));
    };
    
    recognition.start();
    
    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
    };
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error initializing speech recognition'));
    return { stop: () => {} };
  }
};

// Get available speech recognition languages
export const getSpeechRecognitionLanguages = (): string[] => {
  // Common languages - actual browser support varies
  return [
    'en-US', // English (United States)
    'en-GB', // English (United Kingdom)
    'bn-BD', // Bengali (Bangladesh)
    'bn-IN', // Bengali (India)
    'hi-IN', // Hindi
    'ur-PK', // Urdu
    // Add more as needed
  ];
};

// Get most appropriate language for user selection
export const mapLanguageToSpeechRecognition = (language: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'bn': 'bn-BD',
    // Add more mappings as needed
  };
  
  return languageMap[language] || 'en-US';
};
