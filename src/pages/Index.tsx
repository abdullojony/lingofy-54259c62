
import React from 'react';
import NavBar from '../components/NavBar';
import CourseCard from '../components/CourseCard';
import ProfileWidget from '../components/ProfileWidget';

const Index = () => {
  const courses = [
    { language: "Spanish", flagEmoji: "🇪🇸", progress: 45 },
    { language: "French", flagEmoji: "🇫🇷", progress: 20 },
    { language: "Japanese", flagEmoji: "🇯🇵", progress: 10, isNew: true },
    { language: "German", flagEmoji: "🇩🇪", progress: 5 },
    { language: "Italian", flagEmoji: "🇮🇹", progress: 0, isNew: true },
    { language: "Korean", flagEmoji: "🇰🇷", progress: 0 }
  ];

  return (
    <div className="min-h-screen bg-duolingo-light">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-duolingo-dark mb-4">
            Learn a language with Lingofy
          </h1>
          <p className="text-lg text-duolingo-dark/70 max-w-2xl mx-auto">
            Fun, effective lessons that will help you master a new language in no time!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4">Your courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.language}
                  language={course.language}
                  flagEmoji={course.flagEmoji}
                  progress={course.progress}
                  isNew={course.isNew}
                />
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <ProfileWidget streakDays={12} xp={4320} gems={750} />
              
              <div className="mt-6 bg-white shadow-md rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Daily Goal</h3>
                <div className="duo-progress mb-3">
                  <div className="duo-progress-bar w-1/2"></div>
                </div>
                <div className="flex justify-between text-sm text-duolingo-dark/70">
                  <span>10 XP</span>
                  <span>/ 20 XP</span>
                </div>
                <button className="duo-btn w-full mt-4">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
