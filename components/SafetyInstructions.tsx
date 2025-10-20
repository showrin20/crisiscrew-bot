import React from 'react';
import { SafetyInstruction, Language } from '../types';

interface SafetyInstructionsProps {
  severity: 'minor' | 'major' | 'critical' | null;
  language: Language;
}

const translations = {
  en: {
    title: 'Safety Instructions',
    awaiting: 'Submit a fire report to get safety instructions',
    minor: 'Minor Fire',
    major: 'Major Fire',
    critical: 'Critical Fire',
  },
  bn: {
    title: 'নিরাপত্তা নির্দেশনা',
    awaiting: 'নিরাপত্তা নির্দেশনা পেতে একটি অগ্নিকাণ্ডের রিপোর্ট জমা দিন',
    minor: 'ছোট আগুন',
    major: 'বড় আগুন',
    critical: 'মারাত্মক আগুন',
  },
};

const safetyInstructions = {
  en: {
    minor: {
      title: 'Minor Fire - Immediate Actions',
      steps: [
        '🔥 If safe, attempt to extinguish with fire extinguisher',
        '🚪 Keep exits clear and accessible',
        '📞 Call Fire Service: 16163',
        '🏃 Evacuate if fire spreads',
        '🚫 Never use water on electrical or oil fires',
        '🫁 Stay low to avoid smoke inhalation',
      ],
    },
    major: {
      title: 'Major Fire - Evacuation Protocol',
      steps: [
        '🚨 EVACUATE IMMEDIATELY - Do not attempt to fight fire',
        '📢 Alert everyone in the building',
        '📞 Call Fire Service: 16163 NOW',
        '🚪 Close doors behind you to contain fire',
        '🚫 DO NOT use elevators',
        '🫁 Cover nose and mouth with wet cloth',
        '🏃 Move to designated safe zone',
        '✋ Touch doors before opening - if hot, find alternate route',
      ],
    },
    critical: {
      title: 'CRITICAL FIRE - EMERGENCY',
      steps: [
        '🚨 EVACUATE IMMEDIATELY - LIFE THREATENING',
        '📞 CALL 16163 - EMERGENCY',
        '📢 SHOUT "FIRE!" - Alert everyone',
        '🏃 GET OUT FAST - Crawl if smoky',
        '🚪 Close ALL doors behind you',
        '🚫 NEVER go back inside',
        '🫁 If trapped, signal from window',
        '🆘 Call for help continuously',
        '✋ Meet at designated safe point',
      ],
    },
  },
  bn: {
    minor: {
      title: 'ছোট আগুন - তাৎক্ষণিক পদক্ষেপ',
      steps: [
        '🔥 নিরাপদ হলে অগ্নিনির্বাপক দিয়ে নেভানোর চেষ্টা করুন',
        '🚪 বের হওয়ার পথ পরিষ্কার রাখুন',
        '📞 ফায়ার সার্ভিসে কল করুন: ১৬১৬৩',
        '🏃 আগুন ছড়ালে সরে যান',
        '🚫 বৈদ্যুতিক বা তেলের আগুনে পানি ব্যবহার করবেন না',
        '🫁 ধোঁয়া এড়াতে নিচু হয়ে থাকুন',
      ],
    },
    major: {
      title: 'বড় আগুন - সরিয়ে নেওয়ার নিয়ম',
      steps: [
        '🚨 এখনই সরে যান - আগুন নেভানোর চেষ্টা করবেন না',
        '📢 ভবনের সবাইকে সতর্ক করুন',
        '📞 এখনই ফায়ার সার্ভিসে কল করুন: ১৬১৬৩',
        '🚪 আগুন আটকাতে পেছনের দরজা বন্ধ করুন',
        '🚫 লিফট ব্যবহার করবেন না',
        '🫁 ভেজা কাপড় দিয়ে নাক-মুখ ঢেকে নিন',
        '🏃 নিরাপদ স্থানে চলে যান',
        '✋ দরজা খোলার আগে স্পর্শ করে দেখুন - গরম হলে অন্য পথ খুঁজুন',
      ],
    },
    critical: {
      title: 'মারাত্মক আগুন - জরুরি',
      steps: [
        '🚨 এখনই সরে যান - জীবনের ঝুঁকি',
        '📞 ১৬১৬৩ তে কল করুন - জরুরি',
        '📢 "আগুন!" চিৎকার করুন - সবাইকে সতর্ক করুন',
        '🏃 দ্রুত বের হোন - ধোঁয়া থাকলে হামাগুড়ি দিয়ে',
        '🚪 সব দরজা বন্ধ করে যান',
        '🚫 কখনও ভিতরে ফিরবেন না',
        '🫁 আটকা পড়লে জানালা দিয়ে সংকেত দিন',
        '🆘 ক্রমাগত সাহায্যের জন্য চিৎকার করুন',
        '✋ নির্ধারিত নিরাপদ পয়েন্টে মিলিত হন',
      ],
    },
  },
};

const SafetyInstructions: React.FC<SafetyInstructionsProps> = ({ severity, language }) => {
  const t = translations[language];

  if (!severity) {
    return (
      <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{t.title}</h2>
        <p className="text-gray-400 text-center py-8">{t.awaiting}</p>
      </div>
    );
  }

  const instructions = safetyInstructions[language][severity];
  const colors = {
    minor: 'text-green-400 border-green-700',
    major: 'text-orange-400 border-orange-700',
    critical: 'text-red-400 border-red-700',
  };

  return (
    <div className={`bg-gray-800/50 rounded-lg shadow-lg border-2 ${colors[severity]} p-6 animate-pulse-slow`}>
      <h2 className={`text-xl font-bold ${colors[severity].split(' ')[0]} mb-4`}>
        {instructions.title}
      </h2>
      
      <ul className="space-y-3">
        {instructions.steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3 text-gray-200">
            <span className={`font-bold ${colors[severity].split(' ')[0]} text-lg min-w-[24px]`}>
              {index + 1}.
            </span>
            <span className="text-sm leading-relaxed">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SafetyInstructions;
