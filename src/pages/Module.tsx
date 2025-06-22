
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import VideoQuiz from '../components/VideoQuiz';
import Quiz from '../components/Quiz';
import { Module as ModuleType, Quiz as QuizType } from '../types/models';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

// Sample modules data
const modules: Record<string, ModuleType> = {
  "1": {
    "id": 1,
    "title": "Introduction to English Grammar",
    "type": "video",
    "isCompleted": false,
    "isActive": true,
    "subject": "English",
    "content": {
      "videoUrl": "https://www.youtube.com/embed/PIvrl8W_jh0",
      "description": "Learn the basics of English grammar, including parts of speech and sentence structure, in this beginner-friendly introduction.",
      "quizzes": [
        {
          "id": 1,
          "question": "What part of speech describes an action?",
          "options": ["Noun", "Adjective", "Verb", "Adverb"],
          "correctAnswer": 2,
          "timestamp": 45
        },
        {
          "id": 2,
          "question": "Which sentence is grammatically correct?",
          "options": [
            "She go to school every day.",
            "He going to the market.",
            "They goes to the cinema.",
            "I am learning English."
          ],
          "correctAnswer": 3,
          "timestamp": 90
        }
      ]
    }
  },
  "2": {
    "id": 2,
    "title": "English Greetings",
    "type": "reading",
    "isCompleted": false,
    "isActive": true,
    "subject": "English",
    "content": {
      "readingContent": [
        "English is spoken as a first or second language in over 100 countries and is used by more than 1.5 billion people worldwide.",
        "## Common Greetings",
        "- **Hello**: The most common and general greeting used any time of day.",
        "- **Hi**: A casual and friendly version of 'Hello'.",
        "- **Good morning**: Used in the morning, typically until 12 p.m.",
        "- **Good evening**: Used after 5 p.m. or when it starts to get dark.",
        "- **How are you?**: A polite way to ask someone how they are feeling.",
        "## Responses to Greetings",
        "- When someone says 'Hello' or 'Hi', you can respond with the same.",
        "- To 'Good morning', reply with 'Good morning'.",
        "- To 'How are you?', common responses are 'I'm good, thank you!' or 'I'm fine, how about you?'",
        "Learning these basic greetings will help you start conversations and make a positive first impression in English-speaking environments."
      ]
    }
  },
  "3": {
    "id": 3,
    "title": "Quiz on Basic English Phrases",
    "type": "quiz",
    "isCompleted": false,
    "isActive": true,
    "subject": "English",
    "content": {
      "quizzes": [
        {
          "id": 1,
          "question": "How do you say 'Thank you' in English?",
          "options": ["You're welcome", "Please", "Thank you", "Goodbye"],
          "correctAnswer": 2
        },
        {
          "id": 2,
          "question": "Which phrase means 'My name is...'?",
          "options": ["Where are you from?", "My name is...", "I am fine", "Nice to meet you"],
          "correctAnswer": 1
        },
        {
          "id": 3,
          "question": "What does 'Goodbye' mean?",
          "options": ["Hello", "Please", "Goodbye", "Thanks"],
          "correctAnswer": 2
        }
      ]
    }
  },
  "4": {
    id: 4,
    title: "English Writing Practice",
    type: "practice",
    isCompleted: false,
    isActive: true,
    subject: "English",
    content: {
      practiceExercises: [
        "Write a short paragraph introducing yourself in English.",
        "Create five sentences using different verb tenses.",
        "Write a dialogue between two people meeting for the first time."
      ]
    }
  }
};

const Module = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'video';
  const navigate = useNavigate();
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentModule, setCurrentModule] = useState<ModuleType | null>(null);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<string[]>([]);

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
    console.log("Плеер готов");
  };

  const onPlayerStateChange = (event: any) => {
    // Update playing state
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const handleQuizComplete = (correct: boolean) => {
    setShowQuiz(false);
    setActiveQuiz(null);

    if (correct) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer. Keep learning!');
    }

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

  const handleModuleComplete = () => {
    setModuleCompleted(true);
    toast.success('Module completed! Great job!');
    
    // Update module as completed (in a real app, this would be saved to backend)
    if (currentModule) {
      modules[currentModule.id.toString()].isCompleted = true;
    }
  };

  const handleQuizModuleComplete = (score: number) => {
    const percentage = (score / (currentModule?.content?.quizzes?.length || 1)) * 100;
    
    if (percentage >= 70) {
      toast.success(`Quiz completed! You scored ${score}/${currentModule?.content?.quizzes?.length} (${Math.round(percentage)}%)`);
      handleModuleComplete();
    } else {
      toast.error(`You scored ${score}/${currentModule?.content?.quizzes?.length} (${Math.round(percentage)}%). Try again to pass!`);
    }
  };

  const handlePracticeSubmit = () => {
    if (practiceAnswers.some(answer => answer.trim().length > 0)) {
      toast.success('Practice exercises submitted successfully!');
      handleModuleComplete();
    } else {
      toast.error('Please complete at least one exercise before submitting.');
    }
  };

  const renderModuleContent = () => {
    if (!currentModule) {
      return (
        <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Module not found</h1>
          <p className="dark:text-gray-300">Sorry, we couldn't find the requested module.</p>
          <Button onClick={() => navigate('/lesson')} className="mt-4">
            Back to Lessons
          </Button>
        </div>
      );
    }

    switch (currentModule.type) {
      case 'video':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">{currentModule.title}</h1>
            <div className="aspect-video bg-duolingo-gray rounded-lg overflow-hidden mb-4 dark:bg-gray-700">
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
            <div className="text-sm text-duolingo-dark/70 mb-4 dark:text-gray-400">Subject: {currentModule.subject}</div>
            <p className="mb-6 dark:text-gray-300">{currentModule.content?.description}</p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/lesson')}>
                Back to Lessons
              </Button>
              <Button onClick={handleModuleComplete} disabled={moduleCompleted}>
                {moduleCompleted ? 'Completed!' : 'Mark as Complete'}
              </Button>
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
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">{currentModule.title}</h1>
            <div className="space-y-4 mb-8">
              {currentModule.content?.readingContent?.map((paragraph, index) => (
                <div key={index} className="prose max-w-none dark:text-gray-300">
                  {paragraph.startsWith('##') ? (
                    <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">{paragraph.replace('##', '').trim()}</h2>
                  ) : paragraph.startsWith('-') ? (
                    <div className="pl-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/lesson')}>
                Back to Lessons
              </Button>
              <Button onClick={handleModuleComplete} disabled={moduleCompleted}>
                {moduleCompleted ? 'Completed!' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        );

      case 'quiz':
        if (currentModule.content?.quizzes) {
          return (
            <div className="max-w-3xl mx-auto">
              <Quiz
                questions={currentModule.content.quizzes}
                onComplete={handleQuizModuleComplete}
              />
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => navigate('/lesson')}>
                  Back to Lessons
                </Button>
              </div>
            </div>
          );
        }
        return null;

      case 'practice':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">{currentModule.title}</h1>
            <div className="bg-duolingo-light p-6 rounded-lg mb-8 dark:bg-gray-700">
              <h2 className="font-bold mb-4 dark:text-white">Practice Exercises: English Writing</h2>
              <p className="mb-6 dark:text-gray-300">Complete the following exercises to practice your English writing skills.</p>
              <div className="space-y-6">
                {currentModule.content?.practiceExercises?.map((exercise, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-duolingo-gray dark:bg-gray-600 dark:border-gray-500">
                    <p className="font-medium mb-3 dark:text-white">Exercise {index + 1}: {exercise}</p>
                    <textarea
                      className="w-full p-3 border rounded-md resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={4}
                      placeholder="Write your answer here..."
                      value={practiceAnswers[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...practiceAnswers];
                        newAnswers[index] = e.target.value;
                        setPracticeAnswers(newAnswers);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/lesson')}>
                Back to Lessons
              </Button>
              <Button onClick={handlePracticeSubmit} disabled={moduleCompleted}>
                {moduleCompleted ? 'Completed!' : 'Submit Exercises'}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Module Content</h1>
            <p className="dark:text-gray-300">This module type is not yet available.</p>
            <Button onClick={() => navigate('/lesson')} className="mt-4">
              Back to Lessons
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-duolingo-light dark:bg-gray-900">
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
