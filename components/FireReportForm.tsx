import React, { useState, useRef, useEffect } from 'react';
import { FireReport, Language } from '../types';
import { analyzeSeverity } from '../services/geminiService';
import { startSpeechRecognition, mapLanguageToSpeechRecognition } from '../services/speechService';

interface FireReportFormProps {
  onSubmit: (report: Omit<FireReport, 'id' | 'timestamp'> & {
    fireSource?: string;
    peopleTrapped?: boolean;
    buildingType?: string;
    floorNumber?: string;
    hasHazardousMaterials?: boolean;
    hazardousTypes?: string[];
    accessibilityIssues?: string[];
    contactNumber?: string;
  }) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Report Fire Emergency',
    description: 'Describe the fire situation',
    descriptionPlaceholder: 'e.g., Fire in building, smoke visible, people trapped...',
    mediaLink: 'Photo/Video Link (Optional)',
    mediaLinkPlaceholder: 'Paste image or video URL',
    location: 'Location',
    useCurrentLocation: 'Use Current Location',
    manualLocation: 'Enter Address',
    submit: 'Submit Report',
    analyzing: 'Analyzing...',
    locationError: 'Unable to get location',
    locationPlaceholder: 'Enter location or address',
    // New fields
    additionalInfo: 'Additional Information (Optional)',
    fireSource: 'Suspected Fire Source',
    fireSourcePlaceholder: 'Select suspected source of fire',
    peopleTrapped: 'Are people trapped?',
    buildingType: 'Building Type',
    floorNumber: 'Floor Number',
    hazardousMaterials: 'Hazardous Materials Present?',
    hazardousTypes: 'Types of Hazardous Materials',
    accessibilityIssues: 'Accessibility Issues',
    contactNumber: 'Your Contact Number',
    contactNumberPlaceholder: 'For follow-up information',
    yes: 'Yes',
    no: 'No',
    unknown: 'Unknown',
    selectOption: 'Select an option',
    startVoiceInput: 'Use voice input',
    stopListening: 'Stop listening',
    voiceNotSupported: 'Voice input not supported in this browser',
  },
  bn: {
    title: 'আগুনের জরুরি রিপোর্ট করুন',
    description: 'আগুনের পরিস্থিতি বর্ণনা করুন',
    descriptionPlaceholder: 'যেমন: বিল্ডিংয়ে আগুন, ধোঁয়া দৃশ্যমান, মানুষ আটকা পড়েছে...',
    mediaLink: 'ছবি/ভিডিও লিঙ্ক (ঐচ্ছিক)',
    mediaLinkPlaceholder: 'ছবি বা ভিডিও URL পেস্ট করুন',
    location: 'অবস্থান',
    useCurrentLocation: 'বর্তমান অবস্থান ব্যবহার করুন',
    manualLocation: 'ঠিকানা লিখুন',
    submit: 'রিপোর্ট জমা দিন',
    analyzing: 'বিশ্লেষণ করা হচ্ছে...',
    locationError: 'অবস্থান পেতে অক্ষম',
    locationPlaceholder: 'অবস্থান বা ঠিকানা লিখুন',
    // New fields
    additionalInfo: 'অতিরিক্ত তথ্য (ঐচ্ছিক)',
    fireSource: 'সম্ভাব্য আগুনের উৎস',
    fireSourcePlaceholder: 'আগুনের সম্ভাব্য উৎস নির্বাচন করুন',
    peopleTrapped: 'মানুষ আটকা পড়েছে?',
    buildingType: 'ভবনের ধরণ',
    floorNumber: 'তলা নম্বর',
    hazardousMaterials: 'বিপজ্জনক উপাদান আছে?',
    hazardousTypes: 'বিপজ্জনক উপাদানের ধরণ',
    accessibilityIssues: 'প্রবেশযোগ্যতা সমস্যা',
    contactNumber: 'আপনার যোগাযোগ নম্বর',
    contactNumberPlaceholder: 'ফলো-আপ তথ্যের জন্য',
    yes: 'হ্যাঁ',
    no: 'না',
    unknown: 'অজানা',
    selectOption: 'একটি বিকল্প নির্বাচন করুন',
    startVoiceInput: 'ভয়েস ইনপুট ব্যবহার করুন',
    stopListening: 'শোনা বন্ধ করুন',
    voiceNotSupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়',
  },
};

const FireReportForm: React.FC<FireReportFormProps> = ({ onSubmit, language }) => {
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string }>();
  const [manualAddress, setManualAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [listeningField, setListeningField] = useState<'description' | 'address' | null>(null);
  const speechRecognitionRef = useRef<{ stop: () => void } | null>(null);
  
  // New state for additional fields
  const [fireSource, setFireSource] = useState('');
  const [peopleTrapped, setPeopleTrapped] = useState<boolean | undefined>(undefined);
  const [buildingType, setBuildingType] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState<boolean | undefined>(undefined);
  const [hazardousTypes, setHazardousTypes] = useState<string[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<string[]>([]);
  const [contactNumber, setContactNumber] = useState('');

  const t = translations[language];
  
  // Stop speech recognition when component unmounts
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
    };
  }, []);

  const getCurrentLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Reverse geocode to get address (you'd use a real geocoding service)
          setManualAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          setLocationError(t.locationError);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  };
  
  const toggleSpeechRecognition = (fieldName: 'description' | 'address') => {
    if (isListening) {
      // Stop current listening session
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      setIsListening(false);
      setListeningField(null);
      return;
    }
    
    // Start listening for the selected field
    setSpeechError(null);
    setListeningField(fieldName);
    
    try {
      // Map UI language to speech recognition language
      const recognitionLanguage = mapLanguageToSpeechRecognition(language);
      
      speechRecognitionRef.current = startSpeechRecognition(
        (result) => {
          if (fieldName === 'description') {
            setDescription(result.transcript);
          } else if (fieldName === 'address') {
            setManualAddress(result.transcript);
          }
          
          if (result.isComplete) {
            // Automatically stop after a complete sentence
            if (speechRecognitionRef.current) {
              speechRecognitionRef.current.stop();
              speechRecognitionRef.current = null;
              setIsListening(false);
              setListeningField(null);
            }
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setSpeechError(error.message);
          setIsListening(false);
          setListeningField(null);
        },
        { language: recognitionLanguage, continuous: false, interimResults: true }
      );
      
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setSpeechError(error instanceof Error ? error.message : 'Unknown error');
      setListeningField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);

    try {
      // Analyze severity using AI
      const severity = await analyzeSeverity(description);

      const reportLocation = location || {
        lat: 0,
        lng: 0,
        address: manualAddress || 'Unknown',
      };

      onSubmit({
        description,
        severity,
        location: reportLocation,
        photoUrl: mediaUrl || undefined,
        fireSource: fireSource || undefined,
        peopleTrapped: peopleTrapped,
        buildingType: buildingType || undefined,
        floorNumber: floorNumber || undefined,
        hasHazardousMaterials: hasHazardousMaterials,
        hazardousTypes: hazardousTypes.length > 0 ? hazardousTypes : undefined,
        accessibilityIssues: accessibilityIssues.length > 0 ? accessibilityIssues : undefined,
        contactNumber: contactNumber || undefined,
      });

      // Reset form
      setDescription('');
      setMediaUrl('');
      setManualAddress('');
      setFireSource('');
      setPeopleTrapped(undefined);
      setBuildingType('');
      setFloorNumber('');
      setHasHazardousMaterials(undefined);
      setHazardousTypes([]);
      setAccessibilityIssues([]);
      setContactNumber('');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-6">
      <h2 className="text-2xl font-bold text-red-400 mb-6">{t.title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.description}
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
              required
            />
            <button
              type="button"
              onClick={() => toggleSpeechRecognition('description')}
              disabled={isAnalyzing}
              className={`absolute top-2 right-2 p-2 rounded-full ${listeningField === 'description' ? 'bg-red-500 animate-pulse' : 'bg-gray-600'} text-white hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all`}
              title={listeningField === 'description' ? t.stopListening || "Stop listening" : t.startVoiceInput || "Start voice input"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
          {speechError && listeningField === 'description' && (
            <p className="mt-2 text-xs text-yellow-400">
              {speechError === 'Speech recognition not supported in this browser' 
                ? t.voiceNotSupported || 'Voice input not supported in this browser' 
                : speechError
              }
            </p>
          )}
        </div>

        {/* Media Link Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.mediaLink}
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={t.mediaLinkPlaceholder}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
          />
          {mediaUrl && (
            <div className="mt-2">
              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={mediaUrl} alt="Fire preview" className="rounded-md max-h-40 w-auto" />
              ) : mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Video link added ✓
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.location}
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md py-3 px-4 text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.useCurrentLocation}
            </button>
            <div className="relative">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
              />
              <button
                type="button"
                onClick={() => toggleSpeechRecognition('address')}
                disabled={isAnalyzing}
                className={`absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full ${listeningField === 'address' ? 'bg-red-500 animate-pulse' : 'bg-gray-600'} text-white hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all`}
                title={listeningField === 'address' ? t.stopListening || "Stop listening" : t.startVoiceInput || "Start voice input"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            {speechError && listeningField === 'address' && (
              <p className="mt-2 text-xs text-yellow-400">
                {speechError === 'Speech recognition not supported in this browser' 
                  ? t.voiceNotSupported || 'Voice input not supported in this browser' 
                  : speechError
                }
              </p>
            )}
            {locationError && (
              <p className="text-yellow-500 text-xs">{locationError}</p>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-medium text-gray-300 mb-4">{t.additionalInfo}</h3>
          
          {/* Fire Source */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.fireSource}
            </label>
            <select
              value={fireSource}
              onChange={(e) => setFireSource(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:ring-red-500 focus:border-red-500 transition"
            >
              <option value="">{t.selectOption}</option>
              <option value="electrical">Electrical</option>
              <option value="cooking">Cooking</option>
              <option value="chemical">Chemical</option>
              <option value="smoking">Smoking</option>
              <option value="gas_leak">Gas Leak</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          
          {/* People Trapped */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.peopleTrapped}
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="peopleTrapped"
                  checked={peopleTrapped === true}
                  onChange={() => setPeopleTrapped(true)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.yes}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="peopleTrapped"
                  checked={peopleTrapped === false}
                  onChange={() => setPeopleTrapped(false)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.no}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="peopleTrapped"
                  checked={peopleTrapped === undefined}
                  onChange={() => setPeopleTrapped(undefined)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.unknown}</span>
              </label>
            </div>
          </div>
          
          {/* Building Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.buildingType}
            </label>
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:ring-red-500 focus:border-red-500 transition"
            >
              <option value="">{t.selectOption}</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="storage">Storage</option>
              <option value="educational">Educational</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Floor Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.floorNumber}
            </label>
            <select
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:ring-red-500 focus:border-red-500 transition"
            >
              <option value="">{t.selectOption}</option>
              <option value="basement">Basement</option>
              <option value="ground">Ground Floor</option>
              {[...Array(20)].map((_, i) => (
                <option key={i+1} value={(i+1).toString()}>
                  {(i+1).toString()}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Floor
                </option>
              ))}
              <option value="above_20">Above 20th Floor</option>
            </select>
          </div>
          
          {/* Hazardous Materials */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.hazardousMaterials}
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hazardousMaterials"
                  checked={hasHazardousMaterials === true}
                  onChange={() => setHasHazardousMaterials(true)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.yes}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hazardousMaterials"
                  checked={hasHazardousMaterials === false}
                  onChange={() => setHasHazardousMaterials(false)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.no}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hazardousMaterials"
                  checked={hasHazardousMaterials === undefined}
                  onChange={() => setHasHazardousMaterials(undefined)}
                  className="form-radio h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-300">{t.unknown}</span>
              </label>
            </div>
          </div>
          
          {/* Types of Hazardous Materials (only show if hazardous materials is true) */}
          {hasHazardousMaterials === true && (
            <div className="mb-4 ml-4 border-l-2 border-gray-600 pl-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.hazardousTypes}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['flammable_liquids', 'gas', 'chemicals', 'explosives', 'corrosive', 'radioactive'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={hazardousTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHazardousTypes([...hazardousTypes, type]);
                        } else {
                          setHazardousTypes(hazardousTypes.filter(item => item !== type));
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-red-500 focus:ring-red-400"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Accessibility Issues */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.accessibilityIssues}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['narrow_road', 'no_elevator', 'blocked_entrance', 'water_shortage', 'dense_area', 'high_traffic'].map((issue) => (
                <label key={issue} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={accessibilityIssues.includes(issue)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAccessibilityIssues([...accessibilityIssues, issue]);
                      } else {
                        setAccessibilityIssues(accessibilityIssues.filter(item => item !== issue));
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-red-500 focus:ring-red-400"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    {issue.replace('_', ' ').charAt(0).toUpperCase() + issue.replace('_', ' ').slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Contact Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.contactNumber}
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder={t.contactNumberPlaceholder}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnalyzing || !description.trim()}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md py-3 px-4 text-base font-semibold transition"
        >
          {isAnalyzing ? t.analyzing : t.submit}
        </button>
      </form>
    </div>
  );
};

export default FireReportForm;
