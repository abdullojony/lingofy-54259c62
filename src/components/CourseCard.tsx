
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Progress } from './ui/progress';

interface CourseCardProps {
  id: number;
  name: string;
  icon: string;
  progress: number;
  isNew?: boolean;
  type: 'language' | 'subject';
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  id,
  name, 
  icon, 
  progress,
  isNew = false,
  type
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const courseParam = type === 'language' ? 'language' : 'subject';
    navigate(`/lesson?${courseParam}=${name.toLowerCase()}`);
  };

  const renderIcon = () => {
    if (type === 'language') {
      return <div className="text-5xl mb-3">{icon}</div>;
    } else {
      switch (icon) {
        case 'math':
          return <div className="text-4xl mb-3 text-duolingo-blue dark:text-blue-400">π</div>;
        case 'science':
          return <div className="text-4xl mb-3 text-duolingo-green dark:text-green-400">⚗️</div>;
        case 'programming':
          return <div className="text-4xl mb-3 text-duolingo-purple dark:text-purple-400">&lt;/&gt;</div>;
        case 'history':
          return <div className="text-4xl mb-3 text-duolingo-orange dark:text-orange-400">📜</div>;
        case 'art':
          return <div className="text-4xl mb-3 text-duolingo-red dark:text-red-400">🎨</div>;
        default:
          return <BookOpen size={40} className="mb-3 text-duolingo-dark dark:text-gray-300" />;
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="duo-card cursor-pointer flex flex-col items-center hover:shadow-lg transition-shadow"
    >
      <div className="w-full flex justify-end mb-2">
        <div className="w-16">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {renderIcon()}
      <h3 className="text-xl font-bold mb-2 dark:text-white">{name}</h3>
      
      {isNew && (
        <span className="bg-duolingo-purple text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
          НОВОЕ
        </span>
      )}
      
      <p className="text-sm text-duolingo-dark/70 dark:text-gray-400 mt-2">
        {progress}% завершено
      </p>
    </div>
  );
};

export default CourseCard;
