
import React from 'react';
import NavBar from '../components/NavBar';
import ProfileWidget from '../components/ProfileWidget';

const Profile = () => {
  const achievements = [
    { title: "Первый урок", description: "Завершите свой первый урок", emoji: "🎓", completed: true },
    { title: "3-дневная серия", description: "Завершайте уроки 3 дня подряд", emoji: "🔥", completed: true },
    { title: "Идеальный результат", description: "Завершите урок без ошибок", emoji: "⭐", completed: true },
    { title: "Исследователь языков", description: "Попробуйте 3 разных языка", emoji: "🌍", completed: false },
    { title: "Мастер видео", description: "Посмотрите 10 видеоуроков", emoji: "📹", completed: false },
    { title: "Чемпион тестов", description: "Получите идеальные результаты в 5 тестах", emoji: "🏆", completed: false },
  ];

  const recentActivity = [
    { date: "Сегодня", action: "Завершен урок основ испанского", xp: 20 },
    { date: "Сегодня", action: "Просмотрен видеомодуль по математике", xp: 15 },
    { date: "Вчера", action: "Завершен тест по программированию", xp: 25 },
    { date: "2 дня назад", action: "Изучены японские символы", xp: 10 },
    { date: "3 дня назад", action: "Начат курс науки", xp: 5 },
  ];

  return (
    <div className="min-h-screen bg-duolingo-light">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-duolingo-purple text-white text-3xl font-bold rounded-full h-16 w-16 flex items-center justify-center mr-4">
                  П
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Пользователь123</h1>
                  <p className="text-duolingo-dark/70">Присоединился в мае 2025</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-duolingo-green/10 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🔥</span>
                  <span className="font-bold">12-дневная серия</span>
                </div>
                <button className="duo-btn-outline text-sm py-2 px-4">
                  Получить заморозку серии
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Достижения</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.title} 
                  className={`bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center
                    ${!achievement.completed ? 'opacity-50' : ''}`}
                >
                  <div className={`text-3xl mb-2 ${achievement.completed ? '' : 'grayscale'}`}>
                    {achievement.emoji}
                  </div>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-duolingo-dark/70">{achievement.description}</p>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Недавняя активность</h2>
            <div className="bg-white shadow-md rounded-2xl overflow-hidden">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4
                    ${index < recentActivity.length - 1 ? 'border-b border-duolingo-gray' : ''}`}
                >
                  <div>
                    <div className="text-sm text-duolingo-dark/70">{activity.date}</div>
                    <div className="font-medium">{activity.action}</div>
                  </div>
                  <div className="bg-duolingo-blue/10 text-duolingo-blue font-bold px-3 py-1 rounded-full">
                    +{activity.xp} опыта
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ProfileWidget streakDays={12} xp={4320} gems={750} />
            
            <div className="mt-8 bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Прогресс обучения</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-duolingo-blue mb-2">Языки</h4>
                {[
                  { name: "Испанский", progress: 45 },
                  { name: "Французский", progress: 20 },
                  { name: "Японский", progress: 10 }
                ].map((course) => (
                  <div key={course.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-sm text-duolingo-dark/70">{course.progress}%</span>
                    </div>
                    <div className="duo-progress">
                      <div className="duo-progress-bar" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium text-duolingo-green mb-2">Предметы</h4>
                {[
                  { name: "Математика", progress: 30 },
                  { name: "Программирование", progress: 15 },
                  { name: "Наука", progress: 25 }
                ].map((course) => (
                  <div key={course.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-sm text-duolingo-dark/70">{course.progress}%</span>
                    </div>
                    <div className="duo-progress">
                      <div className="duo-progress-bar" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="duo-btn w-full mt-4">Продолжить обучение</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
