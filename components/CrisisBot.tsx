
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askCrisisBot } from '../services/geminiService';
import { SparklesIcon, SendIcon, UserIcon, BotIcon } from './icons/Icons';

const CrisisBot: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Ask me anything about fire safety or emergency procedures. / আগুনের নিরাপত্তা বা জরুরি পদ্ধতি সম্পর্কে আমাকে কিছু জিজ্ঞাসা করুন।' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50">
      <div className="px-4 py-3 border-b border-gray-700/50 flex items-center space-x-2">
        <SparklesIcon className="h-6 w-6 text-red-400" />
        <div>
          <h3 className="text-lg font-semibold leading-6 text-gray-100">CrisisBot AI Assistant</h3>
          <p className="text-xs text-gray-400">24/7 Fire Safety Guidance</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
          <button type="submit" disabled={isLoading || !prompt.trim()} className="p-2 bg-red-600 rounded-md text-white hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrisisBot;
