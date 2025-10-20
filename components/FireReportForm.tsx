import React, { useState, useRef, useEffect } from 'react';
import { FireReport, Language } from '../types';
import { analyzeSeverity } from '../services/geminiService';

interface FireReportFormProps {
  onSubmit: (report: Omit<FireReport, 'id' | 'timestamp'>) => void;
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
  },
};

const FireReportForm: React.FC<FireReportFormProps> = ({ onSubmit, language }) => {
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string }>();
  const [manualAddress, setManualAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationError, setLocationError] = useState('');

  const t = translations[language];

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
      });

      // Reset form
      setDescription('');
      setMediaUrl('');
      setManualAddress('');
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
            required
          />
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
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder={t.locationPlaceholder}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
            />
            {locationError && (
              <p className="text-yellow-500 text-xs">{locationError}</p>
            )}
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
