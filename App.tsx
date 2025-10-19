
import React from 'react';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import StatsCard from './components/StatsCard';
import AlertCard from './components/AlertCard';
import TrainingList from './components/TrainingList';
import CrisisBot from './components/CrisisBot';
import { User, TrainingModule as TrainingModuleType } from './types';
import { ClockIcon, FireIcon, StarIcon, TrendingUpIcon } from './components/icons/Icons';

const App: React.FC = () => {
  // Mock data based on the user-provided document
  const mockUser: User = {
    name: 'Jane Doe',
    level: 'Crisis Cadet',
    points: 1250,
    streak: 12,
    progress: 62,
    avatarUrl: 'https://picsum.photos/100',
  };

  const mockTrainingModules: TrainingModuleType[] = [
    { id: 1, title: 'Basic Fire Safety Protocols', completed: true },
    { id: 2, title: 'First Aid for Burns', completed: true },
    { id: 3, title: 'Crowd Management Techniques', completed: false },
    { id: 4, title: 'Resource Mapping & Allocation', completed: false },
    { id: 5, title: 'VR Simulation: High-Rise Evacuation', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
            <ProfileCard user={mockUser} />
            <div className="grid grid-cols-2 gap-6">
              <StatsCard icon={<FireIcon />} title="Streak" value={`${mockUser.streak} Days`} />
              <StatsCard icon={<StarIcon />} title="Points" value={mockUser.points.toLocaleString()} />
            </div>
             <StatsCard icon={<TrendingUpIcon />} title="Level Progress" value={`${mockUser.progress}%`} isProgress={true} progress={mockUser.progress} />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
            <AlertCard 
              title="ACTIVE INCIDENT: Krishi Market" 
              message="Structural fire reported. Smoke visible from 2km. First responders en route. Awaiting volunteer readiness confirmation." 
            />
            <TrainingList modules={mockTrainingModules} />
          </div>

          {/* Right Column (Chatbot) */}
          <div className="lg:col-span-3 xl:col-span-1 flex flex-col">
            <CrisisBot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
