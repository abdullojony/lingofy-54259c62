
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  language: string;
  flagEmoji: string;
  progress: number;
  isNew?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  language, 
  flagEmoji, 
  progress,
  isNew = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lesson?language=${language.toLowerCase()}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="duo-card cursor-pointer flex flex-col items-center"
    >
      <div className="text-5xl mb-3">{flagEmoji}</div>
      <h3 className="text-xl font-bold mb-2">{language}</h3>
      
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
