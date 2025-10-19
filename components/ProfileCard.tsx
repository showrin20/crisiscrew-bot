
import React from 'react';
import { User } from '../types';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-6 flex flex-col items-center text-center">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-24 h-24 rounded-full border-4 border-red-500/80 object-cover"
      />
      <h2 className="mt-4 text-2xl font-bold text-white">{user.name}</h2>
      <span className="mt-1 text-md font-medium text-red-400">{user.level}</span>
      <div className="w-full mt-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress to Crisis Hero</span>
          <span>{user.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-red-500 h-2.5 rounded-full"
            style={{ width: `${user.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
