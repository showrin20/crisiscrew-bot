
import React from 'react';
import { BellIcon } from './icons/Icons';

interface AlertCardProps {
  title: string;
  message: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, message }) => {
  return (
    <div className="bg-red-900/40 border border-red-600/60 rounded-lg shadow-lg p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <BellIcon className="h-6 w-6 text-red-400" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-red-200">{title}</h3>
        </div>
      </div>
      <div className="mt-3 text-sm text-red-200">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AlertCard;
