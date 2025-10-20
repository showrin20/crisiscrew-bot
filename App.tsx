
import React, { useState } from 'react';
import Header from './components/Header';
import FireReportForm from './components/FireReportForm';
import EmergencyContact from './components/EmergencyContact';
import SafetyInstructions from './components/SafetyInstructions';
import CrisisBot from './components/CrisisBot';
import { FireReport, Language } from './types';
import { analyzeFireReport } from './services/geminiService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentReport, setCurrentReport] = useState<FireReport | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReportSubmit = async (report: Omit<FireReport, 'id' | 'timestamp'>) => {
    const newReport: FireReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setCurrentReport(newReport);
    setIsAnalyzing(true);
    
    // Send report to Gemini for AI analysis
    try {
      const locationStr = report.location.address || 
        `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`;
      
      const response = await analyzeFireReport(
        report.description,
        report.severity,
        locationStr,
        language
      );
      
      setAiResponse(response);
      console.log('Fire report submitted and analyzed:', newReport);
    } catch (error) {
      console.error('Error analyzing fire report:', error);
      setAiResponse(
        language === 'bn' 
          ? 'বিশ্লেষণ করতে ত্রুটি। অবিলম্বে ১৯৯ কল করুন।'
          : 'Analysis error. Please call 199 immediately.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      
      {/* Language Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleLanguage}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 px-4 text-sm font-medium transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {language === 'en' ? 'বাংলা' : 'English'}
        </button>
      </div>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Fire Report Form */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <FireReportForm onSubmit={handleReportSubmit} language={language} />
            <EmergencyContact language={language} />
          </div>

          {/* Center Column - Safety Instructions & AI Response */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SafetyInstructions severity={currentReport?.severity || null} language={language} />
            
            {currentReport && (
              <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">
                  {language === 'en' ? '✓ Report Submitted' : '✓ রিপোর্ট জমা হয়েছে'}
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><strong>{language === 'en' ? 'Severity:' : 'তীব্রতা:'}</strong> {currentReport.severity.toUpperCase()}</p>
                  <p><strong>{language === 'en' ? 'Location:' : 'অবস্থান:'}</strong> {currentReport.location.address || `${currentReport.location.lat}, ${currentReport.location.lng}`}</p>
                  <p><strong>{language === 'en' ? 'Time:' : 'সময়:'}</strong> {currentReport.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            )}

            {/* AI Analysis Response */}
            {(isAnalyzing || aiResponse) && (
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg shadow-lg border border-blue-700/50 p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {language === 'en' ? 'AI Emergency Guidance' : 'AI জরুরি নির্দেশনা'}
                </h3>
                {isAnalyzing ? (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                    <span>{language === 'en' ? 'Analyzing situation...' : 'পরিস্থিতি বিশ্লেষণ করা হচ্ছে...'}</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                    {aiResponse}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Chatbot */}
          <div className="lg:col-span-1 flex flex-col">
            <CrisisBot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
