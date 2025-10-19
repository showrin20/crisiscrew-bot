
import React from 'react';
import { FireIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FireIcon className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white">CrisisCrew</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
