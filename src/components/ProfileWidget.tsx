
import React from 'react';

interface ProfileWidgetProps {
  streakDays: number;
  xp: number;
  gems: number;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({ 
  streakDays, 
  xp, 
  gems 
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Ваша статистика</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-duolingo-orange p-3 rounded-full">
              <span className="text-white text-xl">🔥</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-bold text-lg">{streakDays}</div>
            <div className="text-sm text-duolingo-dark/70 dark:text-gray-400">Дней подряд</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-duolingo-blue p-3 rounded-full">
              <span className="text-white text-xl">⭐</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-bold text-lg">{xp}</div>
            <div className="text-sm text-duolingo-dark/70 dark:text-gray-400">Всего опыта</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-duolingo-purple p-3 rounded-full">
              <span className="text-white text-xl">💎</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-bold text-lg">{gems}</div>
            <div className="text-sm text-duolingo-dark/70 dark:text-gray-400">Кристаллы</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
