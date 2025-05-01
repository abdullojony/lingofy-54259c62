
import React from 'react';
import NavBar from '../components/NavBar';
import ProfileWidget from '../components/ProfileWidget';

const Profile = () => {
  const achievements = [
    { title: "First Lesson", description: "Complete your first lesson", emoji: "🎓", completed: true },
    { title: "3-Day Streak", description: "Complete lessons 3 days in a row", emoji: "🔥", completed: true },
    { title: "Perfect Score", description: "Complete a lesson without mistakes", emoji: "⭐", completed: true },
    { title: "Language Explorer", description: "Try 3 different languages", emoji: "🌍", completed: false },
    { title: "Video Master", description: "Watch 10 video lessons", emoji: "📹", completed: false },
    { title: "Quiz Champion", description: "Get perfect scores on 5 quizzes", emoji: "🏆", completed: false },
  ];

  const recentActivity = [
    { date: "Today", action: "Completed Spanish Basics lesson", xp: 20 },
    { date: "Today", action: "Watched Mathematics video module", xp: 15 },
    { date: "Yesterday", action: "Completed Programming quiz", xp: 25 },
    { date: "2 days ago", action: "Practiced Japanese characters", xp: 10 },
    { date: "3 days ago", action: "Started Science course", xp: 5 },
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
              <h3 className="text-xl font-bold mb-4">Learning Progress</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-duolingo-blue mb-2">Languages</h4>
                {[
                  { name: "Spanish", progress: 45 },
                  { name: "French", progress: 20 },
                  { name: "Japanese", progress: 10 }
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
                <h4 className="font-medium text-duolingo-green mb-2">Subjects</h4>
                {[
                  { name: "Mathematics", progress: 30 },
                  { name: "Programming", progress: 15 },
                  { name: "Science", progress: 25 }
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
              
              <button className="duo-btn w-full mt-4">Continue Learning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
