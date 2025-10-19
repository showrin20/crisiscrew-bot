
import React from 'react';
import DashboardCard from './DashboardCard';
import { TrainingModule } from '../types';
import { CheckCircleIcon, CircleIcon } from './icons/Icons';

interface TrainingListProps {
  modules: TrainingModule[];
}

const TrainingItem: React.FC<{ module: TrainingModule }> = ({ module }) => {
    return (
        <li className="flex items-center justify-between py-3 px-2 rounded-md transition-colors duration-200 hover:bg-gray-700/50">
            <div className="flex items-center">
                {module.completed ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                ) : (
                    <CircleIcon className="h-6 w-6 text-gray-500" />
                )}
                <p className={`ml-3 text-sm font-medium ${module.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                    {module.title}
                </p>
            </div>
            {!module.completed && (
                <button className="text-sm font-semibold text-red-400 hover:text-red-300">
                    Start
                </button>
            )}
        </li>
    );
};

const TrainingList: React.FC<TrainingListProps> = ({ modules }) => {
  return (
    <DashboardCard title="Training Modules">
      <ul className="divide-y divide-gray-700/50 -mt-2">
        {modules.map((module) => (
          <TrainingItem key={module.id} module={module} />
        ))}
      </ul>
    </DashboardCard>
  );
};

export default TrainingList;
