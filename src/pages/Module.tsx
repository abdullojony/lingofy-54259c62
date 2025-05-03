
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
    title: "Введение в арабский",
    type: "video",
    isCompleted: false,
    isActive: true,
    subject: "Арабский",
    content: {
      videoUrl: "https://www.youtube.com/embed/sOQvSkC--mw?enablejsapi=1",
      description: "Изучите основы арабского алфавита и произношения в этом комплексном введении.",
      quizzes: [
        {
          id: 1,
          question: "Сколько букв в арабском алфавите?",
          options: ["22 - ٢٢", "26 - ٢٦", "28 - ٢٨", "29 - ٢٩"],
          correctAnswer: 2,
          timestamp: 30
        },
        {
          id: 2,
          question: "В каком направлении пишется арабский текст?",
          options: ["Слева направо - من اليسار إلى اليمين", "Справа налево - من اليمين إلى اليسار", "Сверху вниз - من الأعلى إلى الأسفل", "Снизу вверх - من الأسفل إلى الأعلى"],
          correctAnswer: 1,
          timestamp: 60
        }
      ]
    }
  },
  "2": {
    id: 2,
    title: "Арабские приветствия",
    type: "reading",
    isCompleted: false,
    isActive: true,
    subject: "Арабский",
    content: {
      readingContent: [
        "Арабский является официальным языком 26 государств и на нем говорят более 420 миллионов человек по всему миру.",
        "## Распространенные приветствия",
        "- **As-salaam 'alykum** (السلام عليكم): Мир вам - самое распространенное приветствие на арабском.",
        "- **Ahlan wa sahlan** (أهلاً و سهلاً): Добро пожаловать - теплое приветствие, используемое для встречи кого-либо.",
        "- **Sabah al-khair** (صباح الخير): Доброе утро - используется до полудня.",
        "- **Masa al-khair** (مساء الخير): Добрый вечер - используется после полудня.",
        "## Ответы на приветствия",
        "- Когда кто-то говорит 'As-salaam 'alykum', вы должны ответить 'Wa 'alykum as-salaam' (وعليكم السلام), что означает 'И вам мир'.",
        "- На 'Sabah al-khair' отвечают 'Sabah an-noor' (صباح النور), что означает 'Утро света'.",
        "Изучение этих базовых приветствий поможет вам произвести хорошее первое впечатление при общении с арабоговорящими."
      ]
    }
  },
  "3": {
    id: 3,
    title: "Тест по базовым арабским фразам",
    type: "quiz",
    isCompleted: false,
    isActive: true,
    subject: "Арабский",
    content: {
      quizzes: [
        {
          id: 1,
          question: "Как сказать 'Спасибо' на арабском?",
          options: ["Afwan - عفوا", "Shukran - شكرا", "Ma'a salama - مع السلامة", "Min fadlak - من فضلك"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Какая фраза означает 'Меня зовут...' на арабском?",
          options: ["Ana min... - أنا من", "Ismi... - اسمي", "Ana... - أنا", "Kayfa halak - كيف حالك"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Что означает 'Ma'a salama'?",
          options: ["Доброе утро - صباح الخير", "Пожалуйста - من فضلك", "До свидания - مع السلامة", "Пожалуйста (в ответ на благодарность) - على الرحب والسعة"],
          correctAnswer: 2
        }
      ]
    }
  },
  "4": {
    id: 4,
    title: "Практика арабского письма",
    type: "practice",
    isCompleted: false,
    isActive: true,
    subject: "Арабский"
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
    
    switch(currentModule.type) {
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
            <div className="text-sm text-duolingo-dark/70 mb-4 dark:text-gray-400">Тема: Изучение арабского</div>
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
