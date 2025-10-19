
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold leading-6 text-gray-100">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
