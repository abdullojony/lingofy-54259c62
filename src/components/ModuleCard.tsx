
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, List } from 'lucide-react';

interface ModuleCardProps {
  id: number; 
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'practice';
  isCompleted: boolean;
  isActive: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  id, 
  title, 
  type,
  isCompleted, 
  isActive 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isActive || isCompleted) {
      navigate(`/module/${id}?type=${type}`);
    }
  };

  let stateClass = "bg-duolingo-gray text-duolingo-dark/50";
  
  if (isActive) {
    stateClass = "bg-duolingo-blue text-white";
  } else if (isCompleted) {
    stateClass = "bg-duolingo-green text-white";
  }

  const renderIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'quiz':
        return <List className="h-6 w-6" />;
      case 'reading':
        return <BookOpen className="h-6 w-6" />;
      case 'practice':
        return <div className="text-lg">🧩</div>;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-20 h-20 rounded-full ${stateClass} flex items-center justify-center mb-2 mx-auto
        cursor-pointer shadow-md hover:shadow-lg transition-all ${!isActive && !isCompleted ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-1">
          {renderIcon()}
        </div>
        <div className="text-xs">{title}</div>
      </div>
    </div>
  );
};

export default ModuleCard;
