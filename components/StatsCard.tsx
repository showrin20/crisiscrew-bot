
import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  isProgress?: boolean;
  progress?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, isProgress = false, progress = 0 }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
            <div className="flex-shrink-0 text-gray-400">
                {icon}
            </div>
            <p className="text-sm font-medium text-gray-400 truncate">{title}</p>
        </div>
        <div className="mt-2">
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        {isProgress && (
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        )}
    </div>
  );
};

export default StatsCard;
