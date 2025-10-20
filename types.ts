
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
  // New fields
  fireSource?: string;
  peopleTrapped?: boolean;
  buildingType?: string;
  floorNumber?: string;
  hasHazardousMaterials?: boolean;
  hazardousTypes?: string[];
  accessibilityIssues?: string[];
  contactNumber?: string;
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
