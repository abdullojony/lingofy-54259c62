
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LessonCard from '../components/LessonCard';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const language = searchParams.get('language') || 'spanish';
  const navigate = useNavigate();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const lessons = [
    { id: 1, title: "Basics", isCompleted: true, isActive: false },
    { id: 2, title: "Phrases", isCompleted: true, isActive: false },
    { id: 3, title: "Travel", isCompleted: false, isActive: true },
    { id: 4, title: "Food", isCompleted: false, isActive: false },
    { id: 5, title: "Family", isCompleted: false, isActive: false },
  ];
  
  const currentQuestion = {
    text: "¿Cómo estás?",
    options: ["How are you?", "Where are you?", "Who are you?", "What is this?"],
    correctAnswer: "How are you?"
  };
  
  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const handleCheckAnswer = () => {
    setShowResult(true);
  };
  
  const handleContinue = () => {
    // In a real app, you'd go to the next question or lesson
    setSelectedAnswer(null);
    setShowResult(false);
    navigate('/');
  };
  
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-duolingo-light">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-duolingo-dark capitalize">
            {language} Course
          </h1>
          
          <div className="mt-8 mb-12 flex justify-center">
            <div className="flex flex-wrap gap-6 max-w-3xl">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex flex-col items-center">
                  <LessonCard
                    id={lesson.id}
                    title={lesson.title}
                    isCompleted={lesson.isCompleted}
                    isActive={lesson.isActive}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-sm uppercase text-duolingo-dark/60 tracking-wider mb-1">Translate this sentence</h2>
            <p className="text-2xl font-bold">{currentQuestion.text}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                className={`p-4 rounded-xl border-2 font-medium text-left transition-all
                  ${selectedAnswer === option 
                    ? 'border-duolingo-green bg-duolingo-green/10' 
                    : 'border-duolingo-gray hover:border-duolingo-green/50'}`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {!showResult ? (
            <button 
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className={`duo-btn w-full ${!selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Check
            </button>
          ) : (
            <div>
              <div className={`mb-6 p-4 rounded-xl flex items-center
                ${isCorrect 
                  ? 'bg-duolingo-green/10 text-duolingo-green' 
                  : 'bg-duolingo-red/10 text-duolingo-red'}`}
              >
                <div className="text-2xl mr-3">
                  {isCorrect ? '🎉' : '😕'}
                </div>
                <div>
                  <p className="font-bold">
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-sm">
                    {isCorrect 
                      ? 'Great job!' 
                      : `The correct answer is "${currentQuestion.correctAnswer}"`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                className="duo-btn w-full"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
