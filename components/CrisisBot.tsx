
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askCrisisBot } from '../services/geminiService';
import { startSpeechRecognition, mapLanguageToSpeechRecognition } from '../services/speechService';
import { SparklesIcon, SendIcon, UserIcon, BotIcon } from './icons/Icons';

const CrisisBot: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Ask me anything about fire safety or emergency procedures. / আগুনের নিরাপত্তা বা জরুরি পদ্ধতি সম্পর্কে আমাকে কিছু জিজ্ঞাসা করুন।' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Stop speech recognition when component unmounts
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await askCrisisBot(prompt);
      const modelMessage: ChatMessage = { role: 'model', text: response };
      setChatHistory((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'error', text: 'Something went wrong. Please try again.' };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSpeechRecognition = () => {
    if (isListening) {
      // Stop listening
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      // Start listening
      setSpeechError(null);
      
      try {
        // Attempt to detect if the user is typing in Bangla to set appropriate language
        const isBangla = prompt.match(/[\u0980-\u09FF]/) !== null;
        const language = isBangla ? 'bn-BD' : 'en-US';
        
        speechRecognitionRef.current = startSpeechRecognition(
          (result) => {
            setPrompt((prev) => result.transcript);
            if (result.isComplete) {
              // Automatically stop after a complete sentence
              if (speechRecognitionRef.current) {
                speechRecognitionRef.current.stop();
                speechRecognitionRef.current = null;
                setIsListening(false);
              }
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setSpeechError(error.message);
            setIsListening(false);
          },
          { language, continuous: false, interimResults: true }
        );
        
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setSpeechError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  return (
    <div className="flex flex-col bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50">
      <div className="px-4 py-3 border-b border-gray-700/50 flex items-center space-x-2">
        <SparklesIcon className="h-6 w-6 text-red-400" />
        <div>
          <h3 className="text-lg font-semibold leading-6 text-gray-100">CrisisBot AI Assistant</h3>
          <p className="text-xs text-gray-400">24/7 Fire Safety Guidance</p>
        </div>
      </div>
      
      <div className="h-64 p-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <BotIcon />}
            <div className={`max-w-xs md:max-w-sm lg:max-w-xs rounded-lg px-4 py-2 ${
                msg.role === 'user' ? 'bg-red-600 text-white' : 
                msg.role === 'model' ? 'bg-gray-700 text-gray-200' : 
                'bg-yellow-800 text-yellow-100'
            }`}>
              <p className="text-sm break-words">{msg.text}</p>
            </div>
            {msg.role === 'user' && <UserIcon />}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3 justify-start">
                 <BotIcon />
                 <div className="bg-gray-700 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                 </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask in English or Bangla..."
            className="flex-1 w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
            disabled={isLoading}
          />
          <button 
            type="button" 
            onClick={toggleSpeechRecognition}
            disabled={isLoading}
            className={`p-2 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600'} rounded-md text-white hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="p-2 bg-red-600 rounded-md text-white hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
          >
            <SendIcon />
          </button>
        </form>
        {speechError && (
          <p className="mt-2 text-xs text-yellow-400">
            {speechError === 'Speech recognition not supported in this browser' 
              ? 'Voice input not supported in this browser' 
              : speechError
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default CrisisBot;
