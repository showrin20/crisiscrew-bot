
export interface FireReport {
  id: string;
  severity: 'minor' | 'major' | 'critical';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  description: string;
  timestamp: Date;
  photoUrl?: string;
  voiceNote?: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
}

export type Language = 'en' | 'bn';

export interface SafetyInstruction {
  title: string;
  steps: string[];
  severity: 'minor' | 'major' | 'critical';
}
