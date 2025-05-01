
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LessonCardProps {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  id, 
  title, 
  isCompleted, 
  isActive 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isActive || isCompleted) {
      navigate(`/lesson/${id}`);
    }
  };

  let stateClass = "bg-duolingo-gray text-duolingo-dark/50";
  
  if (isActive) {
    stateClass = "bg-duolingo-green text-white animate-bounce";
  } else if (isCompleted) {
    stateClass = "bg-duolingo-green text-white";
  }

  return (
    <div 
      onClick={handleClick}
      className={`w-20 h-20 rounded-full ${stateClass} flex items-center justify-center mb-2 mx-auto
        cursor-pointer shadow-md hover:shadow-lg transition-all ${!isActive && !isCompleted ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div className="text-center">
        <div className="text-xl font-bold">{id}</div>
        <div className="text-xs">{title}</div>
      </div>
    </div>
  );
};

export default LessonCard;
