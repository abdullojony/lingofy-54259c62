
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import VideoQuiz from '../components/VideoQuiz';
import { Module as ModuleType, Quiz } from '../types/models';
import { toast } from 'sonner';

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
      "videoUrl": "https://youtu.be/PIvrl8W_jh0?si=ElfTNfzhVObcNEe0",
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
    title: "English writing practice",
    type: "practice",
    isCompleted: false,
    isActive: true,
    subject: "English"
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
    console.log("Плеер готов");
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
        <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Модуль не найден</h1>
          <p className="dark:text-gray-300">К сожалению, мы не смогли найти нужный модуль.</p>
          <button onClick={() => navigate('/')} className="duo-btn mt-4">
            Вернуться на главную
          </button>
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
            <div className="text-sm text-duolingo-dark/70 mb-4 dark:text-gray-400">Тема: English Grammar</div>
            <p className="mb-6 dark:text-gray-300">{currentModule.content?.description}</p>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Назад к урокам
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Завершить и продолжить
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
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Назад к урокам
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Завершить и продолжить
              </button>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">{currentModule.title}</h1>
            <div className="space-y-6">
              {currentModule.content?.quizzes?.map((quiz) => (
                <div key={quiz.id} className="bg-duolingo-light p-6 rounded-lg dark:bg-gray-700">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">{quiz.question}</h3>
                  <div className="space-y-3">
                    {quiz.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-duolingo-light cursor-pointer dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500 dark:text-white">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        </div>
                        <div className="font-normal">{option}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <button className="duo-btn">Проверить ответ</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Назад к урокам
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Завершить и продолжить
              </button>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">{currentModule.title}</h1>
            <div className="bg-duolingo-light p-6 rounded-lg mb-8 dark:bg-gray-700">
              <h2 className="font-bold mb-4 dark:text-white">Практическое упражнение: Арабское письмо</h2>
              <p className="mb-6 dark:text-gray-300">Выполните следующие упражнения для практики написания арабских букв.</p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                  <p className="font-medium">Упражнение 1: Практикуйтесь в написании букв ا (Алиф), ب (Ба), ت (Та).</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                  <p className="font-medium">Упражнение 2: Соедините следующие буквы для образования слов.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                  <p className="font-medium">Упражнение 3: Прочитайте и произнесите следующие короткие фразы.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Назад к урокам
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Завершить и продолжить
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Содержание модуля</h1>
            <p className="dark:text-gray-300">Данный тип модуля пока недоступен.</p>
            <button onClick={() => navigate(-1)} className="duo-btn mt-4">
              Назад к урокам
            </button>
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
