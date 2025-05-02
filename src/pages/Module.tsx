
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import VideoQuiz from '../components/VideoQuiz';
import { Module as ModuleType, Quiz } from '../types/models';
import { toast } from 'sonner';

// Sample modules data
const modules: Record<string, ModuleType> = {
  "1": {
    id: 1,
    title: "Introduction to Arabic",
    type: "video",
    isCompleted: false,
    isActive: true,
    subject: "Arabic",
    content: {
      videoUrl: "https://www.youtube.com/embed/sOQvSkC--mw?enablejsapi=1",
      description: "Learn the basics of Arabic alphabet and pronunciation in this comprehensive introduction.",
      quizzes: [
        {
          id: 1,
          question: "How many letters are in the Arabic alphabet?",
          options: ["22 - ٢٢", "26 - ٢٦", "28 - ٢٨", "29 - ٢٩"],
          correctAnswer: 2,
          timestamp: 30
        },
        {
          id: 2,
          question: "Which direction is Arabic written?",
          options: ["Left to right - من اليسار إلى اليمين", "Right to left - من اليمين إلى اليسار", "Top to bottom - من الأعلى إلى الأسفل", "Bottom to top - من الأسفل إلى الأعلى"],
          correctAnswer: 1,
          timestamp: 60
        }
      ]
    }
  },
  "2": {
    id: 2,
    title: "Arabic Greetings",
    type: "reading",
    isCompleted: false,
    isActive: true,
    subject: "Arabic",
    content: {
      readingContent: [
        "Arabic is the official language of 26 states and is spoken by more than 420 million people worldwide.",
        "## Common Greetings",
        "- **As-salaam 'alykum** (السلام عليكم): Peace be upon you - The most common greeting in Arabic.",
        "- **Ahlan wa sahlan** (أهلاً و سهلاً): Welcome - A warm greeting used to welcome someone.",
        "- **Sabah al-khair** (صباح الخير): Good morning - Used until noon.",
        "- **Masa al-khair** (مساء الخير): Good evening - Used after noon.",
        "## Responding to Greetings",
        "- When someone says 'As-salaam 'alykum', you should respond with 'Wa 'alykum as-salaam' (وعليكم السلام) which means 'And upon you be peace'.",
        "- For 'Sabah al-khair', respond with 'Sabah an-noor' (صباح النور) meaning 'Morning of light'.",
        "Learning these basic greetings will help you make a good first impression when speaking with Arabic speakers."
      ]
    }
  },
  "3": {
    id: 3,
    title: "Basic Arabic Phrases Quiz",
    type: "quiz",
    isCompleted: false,
    isActive: true,
    subject: "Arabic",
    content: {
      quizzes: [
        {
          id: 1,
          question: "How do you say 'Thank you' in Arabic?",
          options: ["Afwan - عفوا", "Shukran - شكرا", "Ma'a salama - مع السلامة", "Min fadlak - من فضلك"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which phrase means 'My name is...' in Arabic?",
          options: ["Ana min... - أنا من", "Ismi... - اسمي", "Ana... - أنا", "Kayfa halak - كيف حالك"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What does 'Ma'a salama' mean?",
          options: ["Good morning - صباح الخير", "Please - من فضلك", "Goodbye - مع السلامة", "You're welcome - على الرحب والسعة"],
          correctAnswer: 2
        }
      ]
    }
  },
  "4": {
    id: 4,
    title: "Arabic Script Practice",
    type: "practice",
    isCompleted: false,
    isActive: true,
    subject: "Arabic"
  }
};

const Module = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'video';
  const navigate = useNavigate();
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentModule, setCurrentModule] = useState<ModuleType | null>(null);
  
  // Get current module data
  useEffect(() => {
    if (id && modules[id]) {
      setCurrentModule(modules[id]);
    }
  }, [id]);
  
  // Setup YouTube API and event listeners
  useEffect(() => {
    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    // Setup YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!videoRef.current) return;
      
      const youtubePlayer = new window.YT.Player(videoRef.current, {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
      
      setPlayer(youtubePlayer);
    };
    
    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null;
      if (player) {
        player.destroy();
      }
    };
  }, []);
  
  // Update current time and check for quizzes
  useEffect(() => {
    if (!player || !currentModule || currentModule.type !== 'video') return;
    
    const timeUpdateInterval = setInterval(() => {
      try {
        const currentSeconds = player.getCurrentTime();
        setCurrentTime(currentSeconds);
        
        // Check if we should show a quiz
        const quizToShow = currentModule.content?.quizzes?.find(quiz => {
          const timestamp = quiz.timestamp || 0;
          return currentSeconds >= timestamp && currentSeconds < timestamp + 1;
        });
        
        if (quizToShow && !showQuiz && !activeQuiz) {
          setActiveQuiz(quizToShow);
          setShowQuiz(true);
          player.pauseVideo();
          setIsPlaying(false);
        }
      } catch (error) {
        // Player might not be ready yet
      }
    }, 1000);
    
    return () => {
      clearInterval(timeUpdateInterval);
    };
  }, [player, showQuiz, activeQuiz, currentModule]);
  
  const onPlayerReady = (event: any) => {
    // Player is ready
    console.log("Player ready");
  };
  
  const onPlayerStateChange = (event: any) => {
    // Update playing state
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };
  
  const handleQuizComplete = (correct: boolean) => {
    setShowQuiz(false);
    setActiveQuiz(null);
    
    // Resume video playback
    if (player) {
      setTimeout(() => {
        player.playVideo();
        setIsPlaying(true);
      }, 500);
    }
  };
  
  const handleQuizClose = () => {
    setShowQuiz(false);
    setActiveQuiz(null);
    
    // Resume video playback
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };
  
  const renderModuleContent = () => {
    if (!currentModule) {
      return (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Module Not Found</h1>
          <p>Sorry, we couldn't find the module you're looking for.</p>
          <button onClick={() => navigate('/')} className="duo-btn mt-4">
            Go Back Home
          </button>
        </div>
      );
    }
    
    switch(currentModule.type) {
      case 'video':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{currentModule.title}</h1>
            <div className="aspect-video bg-duolingo-gray rounded-lg overflow-hidden mb-4">
              <iframe 
                id="youtube-player"
                ref={videoRef}
                className="w-full h-full"
                src={currentModule.content?.videoUrl} 
                title={currentModule.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-sm text-duolingo-dark/70 mb-4">Topic: Arabic Learning</div>
            <p className="mb-6">{currentModule.content?.description}</p>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
            
            {/* Pop-up Quiz Dialog */}
            {activeQuiz && (
              <VideoQuiz 
                quiz={activeQuiz} 
                open={showQuiz} 
                onClose={handleQuizClose}
                onComplete={handleQuizComplete}
              />
            )}
          </div>
        );
        
      case 'reading':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">{currentModule.title}</h1>
            <div className="space-y-4 mb-8">
              {currentModule.content?.readingContent?.map((paragraph, index) => (
                <div key={index} className="prose max-w-none">
                  {paragraph.startsWith('##') ? (
                    <h2 className="text-xl font-bold mt-6 mb-3">{paragraph.replace('##', '').trim()}</h2>
                  ) : paragraph.startsWith('-') ? (
                    <div className="pl-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">{currentModule.title}</h1>
            <div className="space-y-6">
              {currentModule.content?.quizzes?.map((quiz) => (
                <div key={quiz.id} className="bg-duolingo-light p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">{quiz.question}</h3>
                  <div className="space-y-3">
                    {quiz.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-duolingo-light cursor-pointer">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        </div>
                        <div className="font-normal">{option}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <button className="duo-btn">Check Answer</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      case 'practice':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">{currentModule.title}</h1>
            <div className="bg-duolingo-light p-6 rounded-lg mb-8">
              <h2 className="font-bold mb-4">Practice Exercise: Arabic Script</h2>
              <p className="mb-6">Complete the following exercises to practice writing Arabic letters.</p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 1: Practice writing the letters ا (Alif), ب (Ba), ت (Ta).</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 2: Connect the following letters to form words.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 3: Read and pronounce the following short phrases.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Module Content</h1>
            <p>This module type is not yet available.</p>
            <button onClick={() => navigate(-1)} className="duo-btn mt-4">
              Back to Lessons
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-duolingo-light">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};

// Extend Window interface to include YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default Module;
