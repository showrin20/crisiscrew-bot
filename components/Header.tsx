
import React from 'react';
import { FireIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-red-600 border-b border-red-700/50 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FireIcon className="h-8 w-8 text-white animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">CrisisCrew</h1>
              <p className="text-xs text-red-100">Quick Fire Emergency Reporting</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-red-700 px-3 py-1 rounded-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-white font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
