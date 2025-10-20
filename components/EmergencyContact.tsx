import React from 'react';
import { FireReport, Language } from '../types';

interface EmergencyContactProps {
  report?: FireReport;
  language: Language;
}

const translations = {
  en: {
    title: 'Emergency Contacts',
    fireService: 'Fire Service',
    call: 'Call Now',
    police: 'Police',
    ambulance: 'Ambulance',
    dhaka: 'Dhaka Fire Service',
  },
  bn: {
    title: 'জরুরি যোগাযোগ',
    fireService: 'ফায়ার সার্ভিস',
    call: 'এখনই কল করুন',
    police: 'পুলিশ',
    ambulance: 'অ্যাম্বুলেন্স',
    dhaka: 'ঢাকা ফায়ার সার্ভিস',
  },
};

const emergencyNumbers = {
  fireService: '16163',
  police: '999',
  ambulance: '199',
  dhakaFireService: '+880-2-9555555',
};

const EmergencyContact: React.FC<EmergencyContactProps> = ({ language }) => {
  const t = translations[language];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-6">
      <h2 className="text-xl font-bold text-red-400 mb-4">{t.title}</h2>
      
      <div className="space-y-3">
        <button
          onClick={() => handleCall(emergencyNumbers.fireService)}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md py-4 px-4 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-full">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">{t.fireService}</div>
              <div className="text-sm text-gray-300">{emergencyNumbers.fireService}</div>
            </div>
          </div>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        <button
          onClick={() => handleCall(emergencyNumbers.dhakaFireService)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-md py-3 px-4 text-left transition flex items-center justify-between"
        >
          <div>
            <div className="font-semibold text-sm">{t.dhaka}</div>
            <div className="text-xs text-gray-200">{emergencyNumbers.dhakaFireService}</div>
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCall(emergencyNumbers.police)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 px-4 text-center transition"
          >
            <div className="font-semibold text-sm">{t.police}</div>
            <div className="text-xs">{emergencyNumbers.police}</div>
          </button>
          <button
            onClick={() => handleCall(emergencyNumbers.ambulance)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-md py-3 px-4 text-center transition"
          >
            <div className="font-semibold text-sm">{t.ambulance}</div>
            <div className="text-xs">{emergencyNumbers.ambulance}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
