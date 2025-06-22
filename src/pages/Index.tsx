
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CourseCard from '../components/CourseCard';
import ProfileWidget from '../components/ProfileWidget';
import { Button } from '../components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const languages = [
    { id: 1, name: "Испанский", icon: "🇪🇸", progress: 45, type: 'language' },
    { id: 2, name: "Французский", icon: "🇫🇷", progress: 20, type: 'language' },
    { id: 3, name: "Японский", icon: "🇯🇵", progress: 10, isNew: true, type: 'language' },
    { id: 4, name: "Немецкий", icon: "🇩🇪", progress: 5, type: 'language' }
  ];

  const subjects = [
    { id: 1, name: "Математика", icon: "math", progress: 30, type: 'subject' },
    { id: 2, name: "Программирование", icon: "programming", progress: 15, isNew: true, type: 'subject' },
    { id: 3, name: "Наука", icon: "science", progress: 25, type: 'subject' },
    { id: 4, name: "История", icon: "history", progress: 5, isNew: true, type: 'subject' }
  ];

  const handleContinueLearning = () => {
    // Navigate to the most recently accessed course (defaulting to English for demo)
    navigate('/lesson?language=english');
  };

  return (
    <div className="min-h-screen bg-duolingo-light dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-duolingo-dark mb-4 dark:text-gray-100">
            Изучайте всё с Линговай
          </h1>
          <p className="text-lg text-duolingo-dark/70 max-w-2xl mx-auto dark:text-gray-400">
            Изучайте языки, академические предметы и профессиональные навыки с нашими интерактивными уроками!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Языки</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {languages.map((language) => (
                <CourseCard
                  key={language.id}
                  id={language.id}
                  name={language.name}
                  icon={language.icon}
                  progress={language.progress}
                  isNew={language.isNew}
                  type="language"
                />
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Предметы</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <CourseCard
                  key={subject.id}
                  id={subject.id}
                  name={subject.name}
                  icon={subject.icon}
                  progress={subject.progress}
                  isNew={subject.isNew}
                  type="subject"
                />
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <ProfileWidget streakDays={12} xp={4320} gems={750} />
              
              <div className="mt-6 bg-white shadow-md rounded-2xl p-6 dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Ежедневная цель</h3>
                <div className="duo-progress mb-3">
                  <div className="duo-progress-bar w-1/2"></div>
                </div>
                <div className="flex justify-between text-sm text-duolingo-dark/70 dark:text-gray-400">
                  <span>10 опыта</span>
                  <span>/ 20 опыта</span>
                </div>
                <Button onClick={handleContinueLearning} className="w-full mt-4">
                  Продолжить обучение
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
