
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LessonCard from '../components/LessonCard';
import ModuleCard from '../components/ModuleCard';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const language = searchParams.get('language');
  const subject = searchParams.get('subject');
  const navigate = useNavigate();
  
  const isLanguage = !!language;
  const courseName = language || subject || 'испанский';
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Traditional language lessons
  const languageLessons = [
    { id: 1, title: "Основы", isCompleted: true, isActive: false },
    { id: 2, title: "Фразы", isCompleted: true, isActive: false },
    { id: 3, title: "Поездки", isCompleted: false, isActive: true },
    { id: 4, title: "Еда", isCompleted: false, isActive: false },
    { id: 5, title: "Семья", isCompleted: false, isActive: false },
  ];
  
  // Subject modules with different types
  const subjectModules = [
    { id: 1, title: "Введение", type: "video", isCompleted: true, isActive: false },
    { id: 2, title: "Понятия", type: "reading", isCompleted: true, isActive: false },
    { id: 3, title: "Примеры", type: "practice", isCompleted: false, isActive: true },
    { id: 4, title: "Оценка", type: "quiz", isCompleted: false, isActive: false },
  ];
  
  const currentQuestion = {
    text: isLanguage ? "¿Cómo estás?" : "Чему равна производная x²?",
    options: isLanguage 
      ? ["Как дела?", "Где ты?", "Кто ты?", "Что это?"]
      : ["2x", "x²", "2", "Ничего из перечисленного"],
    correctAnswer: isLanguage ? "Как дела?" : "2x"
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

  const getModuleContent = () => {
    if (isLanguage) {
      return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 dark:bg-gray-800">
          <div className="mb-8">
            <h2 className="text-sm uppercase text-duolingo-dark/60 tracking-wider mb-1 dark:text-gray-400">Переведите это предложение</h2>
            <p className="text-2xl font-bold dark:text-white">{currentQuestion.text}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                className={`p-4 rounded-xl border-2 font-medium text-left transition-all
                  ${selectedAnswer === option 
                    ? 'border-duolingo-green bg-duolingo-green/10' 
                    : 'border-duolingo-gray hover:border-duolingo-green/50'} dark:text-white`}
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
              Проверить
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
                    {isCorrect ? 'Правильно!' : 'Не совсем верно'}
                  </p>
                  <p className="text-sm">
                    {isCorrect 
                      ? 'Отличная работа!' 
                      : `Правильный ответ: "${currentQuestion.correctAnswer}"`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                className="duo-btn w-full"
              >
                Продолжить
              </button>
            </div>
          )}
        </div>
      );
    } else {
      // Subject content with current module type - showing quiz as an example
      return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 dark:bg-gray-800">
          <div className="mb-8">
            <h2 className="text-sm uppercase text-duolingo-dark/60 tracking-wider mb-1 dark:text-gray-400">Тестовый вопрос</h2>
            <p className="text-2xl font-bold dark:text-white">{currentQuestion.text}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                className={`p-4 rounded-xl border-2 font-medium text-left transition-all
                  ${selectedAnswer === option 
                    ? 'border-duolingo-blue bg-duolingo-blue/10' 
                    : 'border-duolingo-gray hover:border-duolingo-blue/50'} dark:text-white`}
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
              Проверить ответ
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
                    {isCorrect ? 'Правильно!' : 'Не совсем верно'}
                  </p>
                  <p className="text-sm">
                    {isCorrect 
                      ? 'Отличная работа!' 
                      : `Правильный ответ: "${currentQuestion.correctAnswer}"`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                className="duo-btn w-full"
              >
                Продолжить
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-duolingo-light dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-duolingo-dark capitalize dark:text-white">
            {courseName} {isLanguage ? 'Курс' : 'Предмет'}
          </h1>
          
          <div className="mt-8 mb-12 flex justify-center">
            <div className="flex flex-wrap gap-6 max-w-3xl">
              {isLanguage ? (
                // Language lessons
                languageLessons.map((lesson) => (
                  <div key={lesson.id} className="flex flex-col items-center">
                    <LessonCard
                      id={lesson.id}
                      title={lesson.title}
                      isCompleted={lesson.isCompleted}
                      isActive={lesson.isActive}
                    />
                  </div>
                ))
              ) : (
                // Subject modules with different types
                subjectModules.map((module) => (
                  <div key={module.id} className="flex flex-col items-center">
                    <ModuleCard
                      id={module.id}
                      title={module.title}
                      type={module.type as 'video' | 'quiz' | 'reading' | 'practice'}
                      isCompleted={module.isCompleted}
                      isActive={module.isActive}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {getModuleContent()}
      </div>
    </div>
  );
};

export default Lesson;
