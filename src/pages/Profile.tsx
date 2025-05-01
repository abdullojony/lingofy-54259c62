
import React from 'react';
import NavBar from '../components/NavBar';
import ProfileWidget from '../components/ProfileWidget';

const Profile = () => {
  const achievements = [
    { title: "First Lesson", description: "Complete your first lesson", emoji: "🎓", completed: true },
    { title: "3-Day Streak", description: "Complete lessons 3 days in a row", emoji: "🔥", completed: true },
    { title: "Perfect Score", description: "Complete a lesson without mistakes", emoji: "⭐", completed: true },
    { title: "Language Explorer", description: "Try 3 different languages", emoji: "🌍", completed: false },
    { title: "Conversation Master", description: "Complete all conversation lessons", emoji: "💬", completed: false },
    { title: "Grammar Guru", description: "Complete all grammar lessons", emoji: "📚", completed: false },
  ];

  const recentActivity = [
    { date: "Today", action: "Completed Spanish Basics lesson", xp: 20 },
    { date: "Today", action: "Earned 'Perfect Score' achievement", xp: 50 },
    { date: "Yesterday", action: "Completed French Introduction", xp: 15 },
    { date: "2 days ago", action: "Practiced Japanese characters", xp: 10 },
    { date: "3 days ago", action: "Started German course", xp: 5 },
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
                  U
                </div>
                <div>
                  <h1 className="text-2xl font-bold">User123</h1>
                  <p className="text-duolingo-dark/70">Joined May 2025</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-duolingo-green/10 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🔥</span>
                  <span className="font-bold">12 Day Streak</span>
                </div>
                <button className="duo-btn-outline text-sm py-2 px-4">
                  Get Streak Freeze
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
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
            
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
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
                    +{activity.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ProfileWidget streakDays={12} xp={4320} gems={750} />
            
            <div className="mt-8 bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Language Progress</h3>
              {[
                { language: "Spanish", progress: 45 },
                { language: "French", progress: 20 },
                { language: "Japanese", progress: 10 }
              ].map((course) => (
                <div key={course.language} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{course.language}</span>
                    <span className="text-sm text-duolingo-dark/70">{course.progress}%</span>
                  </div>
                  <div className="duo-progress">
                    <div className="duo-progress-bar" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              ))}
              <button className="duo-btn w-full mt-4">Continue Learning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
