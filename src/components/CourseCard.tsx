
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, List } from 'lucide-react';

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
    navigate(`/lesson?${type}=${name.toLowerCase()}`);
  };

  const renderIcon = () => {
    if (type === 'language') {
      return <div className="text-5xl mb-3">{icon}</div>;
    } else {
      switch (icon) {
        case 'math':
          return <div className="text-4xl mb-3 text-duolingo-blue">π</div>;
        case 'science':
          return <div className="text-4xl mb-3 text-duolingo-green">⚗️</div>;
        case 'programming':
          return <div className="text-4xl mb-3 text-duolingo-purple">&lt;/&gt;</div>;
        case 'history':
          return <div className="text-4xl mb-3 text-duolingo-orange">📜</div>;
        case 'art':
          return <div className="text-4xl mb-3 text-duolingo-red">🎨</div>;
        default:
          return <BookOpen size={40} className="mb-3 text-duolingo-dark" />;
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="duo-card cursor-pointer flex flex-col items-center"
    >
      {renderIcon()}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      
      {isNew && (
        <span className="bg-duolingo-purple text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
          NEW
        </span>
      )}
      
      <div className="w-full duo-progress mt-2">
        <div 
          className="duo-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-duolingo-dark/70 mt-2">
        {progress}% complete
      </p>
    </div>
  );
};

export default CourseCard;
