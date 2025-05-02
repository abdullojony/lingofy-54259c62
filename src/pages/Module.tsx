
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import VideoQuiz from '../components/VideoQuiz';
import { Quiz } from '../types/models';
import { toast } from 'sonner';

interface VideoContent {
  title: string;
  url: string;
  description: string;
  duration: string;
  quizzes?: Quiz[];
}

interface ReadingContent {
  title: string;
  content: string[];
}

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
  
  // Sample video content
  const videoContent: VideoContent = {
    title: "Introduction to Mathematics",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1", // Modified URL to enable JS API
    description: "This video introduces the fundamental concepts of mathematics that you'll need throughout this course.",
    duration: "10:30",
    quizzes: [
      {
        id: 1,
        question: "What is the square root of 9?",
        options: ["1", "3", "9", "27"],
        correctAnswer: 1,
        timestamp: 10 // Show quiz after 10 seconds
      },
      {
        id: 2,
        question: "Which of these is not a prime number?",
        options: ["2", "3", "5", "9"],
        correctAnswer: 3,
        timestamp: 30 // Show quiz after 30 seconds
      }
    ]
  };
  
  // Sample reading content
  const readingContent: ReadingContent = {
    title: "Basic Programming Concepts",
    content: [
      "Programming is the process of creating instructions that tell a computer how to perform a task.",
      "Variables are containers for storing data values. In most programming languages, you need to declare a variable before you can use it.",
      "Functions are blocks of code designed to perform a particular task. They are executed when they are called.",
      "Conditionals allow you to make decisions in your code. The most common form is the if statement."
    ]
  };

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
    if (!player || type !== 'video') return;
    
    const timeUpdateInterval = setInterval(() => {
      try {
        const currentSeconds = player.getCurrentTime();
        setCurrentTime(currentSeconds);
        
        // Check if we should show a quiz
        const quizToShow = videoContent.quizzes?.find(quiz => {
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
  }, [player, showQuiz, activeQuiz, type]);
  
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
    switch(type) {
      case 'video':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{videoContent.title}</h1>
            <div className="aspect-video bg-duolingo-gray rounded-lg overflow-hidden mb-4">
              <iframe 
                id="youtube-player"
                ref={videoRef}
                className="w-full h-full"
                src={videoContent.url} 
                title={videoContent.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-sm text-duolingo-dark/70 mb-4">Duration: {videoContent.duration}</div>
            <p className="mb-6">{videoContent.description}</p>
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
            <h1 className="text-2xl font-bold mb-6">{readingContent.title}</h1>
            <div className="space-y-4 mb-8">
              {readingContent.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
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
        
      case 'practice':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Practice Session</h1>
            <div className="bg-duolingo-light p-6 rounded-lg mb-8">
              <h2 className="font-bold mb-4">Exercise: Apply what you've learned</h2>
              <p className="mb-6">Complete the following exercises to practice the concepts covered in this module.</p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 1: Solve the problem using the technique demonstrated.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 2: Explain the underlying principles in your own words.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 3: Apply the concept to a new situation.</p>
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
