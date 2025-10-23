import React, { useState, useEffect } from 'react';
import { getApiKey, setCustomApiKey, getRemainingUsage } from '../services/geminiService';
import { Language } from '../types';

interface ApiKeySettingsProps {
  language: Language;
}

const translations = {
  en: {
    title: 'API Settings',
    description: 'Use your own Google Gemini API key to avoid usage limits.',
    apiKeyLabel: 'Your API Key',
    apiKeyPlaceholder: 'Enter your Google Gemini API key',
    saveButton: 'Save API Key',
    clearButton: 'Clear API Key',
    usageRemaining: 'API calls remaining today:',
    unlimited: 'Unlimited (using custom key)',
    apiKeySaved: 'API key saved successfully',
    apiKeyCleared: 'API key cleared',
    getApiKey: 'Get your API key from Google AI Studio',
    customKeyActive: 'Using custom API key',
    defaultKeyActive: 'Using default API key'
  },
  bn: {
    title: 'API সেটিংস',
    description: 'ব্যবহারের সীমা এড়াতে আপনার নিজের Google Gemini API কী ব্যবহার করুন।',
    apiKeyLabel: 'আপনার API কী',
    apiKeyPlaceholder: 'আপনার Google Gemini API কী লিখুন',
    saveButton: 'API কী সংরক্ষণ করুন',
    clearButton: 'API কী মুছুন',
    usageRemaining: 'আজকের বাকি API কল:',
    unlimited: 'অসীমিত (কাস্টম কী ব্যবহার করে)',
    apiKeySaved: 'API কী সফলভাবে সংরক্ষিত হয়েছে',
    apiKeyCleared: 'API কী মুছে ফেলা হয়েছে',
    getApiKey: 'Google AI Studio থেকে আপনার API কী নিন',
    customKeyActive: 'কাস্টম API কী ব্যবহার করা হচ্ছে',
    defaultKeyActive: 'ডিফল্ট API কী ব্যবহার করা হচ্ছে'
  }
};

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ language }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isCustomKeyActive, setIsCustomKeyActive] = useState<boolean>(false);
  const [remainingUsage, setRemainingUsage] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const t = translations[language];
  
  useEffect(() => {
    // Check if a custom key is being used
    const currentKey = getApiKey();
    const defaultKey = import.meta.env.VITE_API_KEY || '';
    setIsCustomKeyActive(currentKey !== defaultKey && currentKey !== '');
    
    // Get remaining usage
    setRemainingUsage(getRemainingUsage());
    
    // Reset API key input field to empty (for security)
    setApiKey('');
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setCustomApiKey(apiKey.trim());
      setIsCustomKeyActive(true);
      setMessage(t.apiKeySaved);
      setApiKey(''); // Clear input for security
      
      // Update remaining usage (should be unlimited now)
      setRemainingUsage(getRemainingUsage());
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handleClearApiKey = () => {
    setCustomApiKey('');
    setIsCustomKeyActive(false);
    setMessage(t.apiKeyCleared);
    setApiKey('');
    
    // Update remaining usage (should be limited now)
    setRemainingUsage(getRemainingUsage());
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };
  
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 overflow-hidden">
      <div 
        className="p-4 bg-gray-700/50 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-md font-medium text-gray-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          {t.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isCustomKeyActive ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
            {isCustomKeyActive ? t.customKeyActive : t.defaultKeyActive}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4">
          <p className="text-sm text-gray-300 mb-4">
            {t.description}
          </p>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-300">
                {t.apiKeyLabel}
              </label>
              <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline"
              >
                {t.getApiKey}
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400"
              />
              <button
                onClick={handleSaveApiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 text-sm font-medium"
              >
                {t.saveButton}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-400">{t.usageRemaining}</span>{' '}
              <span className={isCustomKeyActive ? 'text-green-400' : 'text-yellow-400'}>
                {isCustomKeyActive ? t.unlimited : remainingUsage}
              </span>
            </div>
            
            {isCustomKeyActive && (
              <button
                onClick={handleClearApiKey}
                className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded px-2 py-1"
              >
                {t.clearButton}
              </button>
            )}
          </div>
          
          {message && (
            <div className="mt-3 text-sm text-green-400">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiKeySettings;
