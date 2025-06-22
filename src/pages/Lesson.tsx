
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ModuleCard from '../components/ModuleCard';
import { Button } from '../components/ui/button';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subject = searchParams.get('language') || searchParams.get('subject') || 'english';

  // Sample lesson modules
  const modules = [
    {
      id: 1,
      title: "Введение в грамматику",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
    },
    {
      id: 2,
      title: "Приветствия",
      type: "reading" as const,
      isCompleted: false,
      isActive: true,
    },
    {
      id: 3,
      title: "Базовый тест",
      type: "quiz" as const,
      isCompleted: false,
      isActive: true,
    },
    {
      id: 4,
      title: "Письменная практика",
      type: "practice" as const,
      isCompleted: false,
      isActive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-duolingo-light dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-duolingo-dark dark:text-white capitalize">
                  Курс {subject}
                </h1>
                <p className="text-duolingo-dark/70 dark:text-gray-400 mt-2">
                  Завершите модули ниже, чтобы продвигаться в своем обучении
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                Назад к курсам
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="flex flex-col items-center">
                  <ModuleCard
                    id={module.id}
                    title={module.title}
                    type={module.type}
                    isCompleted={module.isCompleted}
                    isActive={module.isActive}
                  />
                  <p className="text-sm text-center mt-2 text-duolingo-dark/70 dark:text-gray-400">
                    {module.title}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-duolingo-light rounded-lg dark:bg-gray-700">
              <h3 className="font-bold mb-2 dark:text-white">Прогресс курса</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-duolingo-gray rounded-full h-3 dark:bg-gray-600">
                  <div className="bg-duolingo-green h-3 rounded-full w-0 transition-all duration-300"></div>
                </div>
                <span className="text-sm font-medium dark:text-gray-300">0% завершено</span>
              </div>
              <p className="text-sm text-duolingo-dark/70 dark:text-gray-400 mt-2">
                Завершайте модули, чтобы разблокировать новый контент и отслеживать прогресс
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
