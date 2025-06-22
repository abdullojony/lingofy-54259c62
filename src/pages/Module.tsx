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
    "title": "Введение в английскую грамматику",
    "type": "video",
    "isCompleted": false,
    "isActive": true,
    "subject": "Английский",
    "content": {
      "videoUrl": "https://www.youtube.com/embed/PIvrl8W_jh0",
      "description": "Изучите основы английской грамматики, включая части речи и структуру предложений, в этом введении для начинающих.",
      "quizzes": [
        {
          "id": 1,
          "question": "Какая часть речи описывает действие?",
          "options": ["Noun", "Adjective", "Verb", "Adverb"],
          "correctAnswer": 2,
          "timestamp": 45
        },
        {
          "id": 2,
          "question": "Какое предложение грамматически правильное?",
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
    "title": "Английские приветствия",
    "type": "reading",
    "isCompleted": false,
    "isActive": true,
    "subject": "Английский",
    "content": {
      "readingContent": [
        "Английский язык используется как первый или второй язык в более чем 100 странах и используется более чем 1,5 миллиардами людей по всему миру.",
        "## Обычные приветствия",
        "- **Hello**: Самое распространенное и общее приветствие, используемое в любое время дня.",
        "- **Hi**: Непринужденная и дружелюбная версия 'Hello'.",
        "- **Good morning**: Используется утром, обычно до 12 часов дня.",
        "- **Good evening**: Используется после 17:00 или когда начинает темнеть.",
        "- **How are you?**: Вежливый способ спросить кого-то, как они себя чувствуют.",
        "## Ответы на приветствия",
        "- Когда кто-то говорит 'Hello' или 'Hi', вы можете ответить тем же.",
        "- На 'Good morning' отвечайте 'Good morning'.",
        "- На 'How are you?' обычные ответы: 'I'm good, thank you!' или 'I'm fine, how about you?'",
        "Изучение этих основных приветствий поможет вам начинать разговоры и производить положительное первое впечатление в англоязычной среде."
      ]
    }
  },
  "3": {
    "id": 3,
    "title": "Тест по основным английским фразам",
    "type": "quiz",
    "isCompleted": false,
    "isActive": true,
    "subject": "Английский",
    "content": {
      "quizzes": [
        {
          "id": 1,
          "question": "Как сказать 'Спасибо' по-английски?",
          "options": ["You're welcome", "Please", "Thank you", "Goodbye"],
          "correctAnswer": 2
        },
        {
          "id": 2,
          "question": "Какая фраза означает 'Меня зовут...'?",
          "options": ["Where are you from?", "My name is...", "I am fine", "Nice to meet you"],
          "correctAnswer": 1
        },
        {
          "id": 3,
          "question": "Что означает 'До свидания' по-английски?",
          "options": ["Hello", "Please", "Goodbye", "Thanks"],
          "correctAnswer": 2
        }
      ]
    }
  },
  "4": {
    id: 4,
    title: "Практика письма на английском",
    type: "practice",
    isCompleted: false,
    isActive: true,
    subject: "Английский",
    content: {
      practiceExercises: [
        "Напишите короткий абзац, представляя себя на английском языке.",
        "Создайте пять предложений, используя разные времена глаголов.",
        "Напишите диалог между двумя людьми, встречающимися впервые."
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
      toast.success('Правильный ответ!');
    } else {
      toast.error('Неправильный ответ. Продолжайте учиться!');
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

    // Resume video playbook
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const handleModuleComplete = () => {
    setModuleCompleted(true);
    toast.success('Модуль завершен! Отличная работа!');
    
    // Update module as completed (in a real app, this would be saved to backend)
    if (currentModule) {
      modules[currentModule.id.toString()].isCompleted = true;
    }
  };

  const handleQuizModuleComplete = (score: number) => {
    const percentage = (score / (currentModule?.content?.quizzes?.length || 1)) * 100;
    
    if (percentage >= 70) {
      toast.success(`Тест завершен! Ваш результат ${score}/${currentModule?.content?.quizzes?.length} (${Math.round(percentage)}%)`);
      handleModuleComplete();
    } else {
      toast.error(`Ваш результат ${score}/${currentModule?.content?.quizzes?.length} (${Math.round(percentage)}%). Попробуйте еще раз, чтобы пройти!`);
    }
  };

  const handlePracticeSubmit = () => {
    if (practiceAnswers.some(answer => answer.trim().length > 0)) {
      toast.success('Практические упражнения успешно отправлены!');
      handleModuleComplete();
    } else {
      toast.error('Пожалуйста, выполните хотя бы одно упражнение перед отправкой.');
    }
  };

  const renderModuleContent = () => {
    if (!currentModule) {
      return (
        <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Модуль не найден</h1>
          <p className="dark:text-gray-300">Извините, мы не смогли найти запрашиваемый модуль.</p>
          <Button onClick={() => navigate('/lesson')} className="mt-4">
            Назад к урокам
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
            <div className="text-sm text-duolingo-dark/70 mb-4 dark:text-gray-400">Предмет: {currentModule.subject}</div>
            <p className="mb-6 dark:text-gray-300">{currentModule.content?.description}</p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/lesson')}>
                Назад к урокам
              </Button>
              <Button onClick={handleModuleComplete} disabled={moduleCompleted}>
                {moduleCompleted ? 'Завершено!' : 'Отметить как завершенное'}
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
                Назад к урокам
              </Button>
              <Button onClick={handleModuleComplete} disabled={moduleCompleted}>
                {moduleCompleted ? 'Завершено!' : 'Отметить как завершенное'}
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
                  Назад к урокам
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
              <h2 className="font-bold mb-4 dark:text-white">Практические упражнения: Письмо на английском</h2>
              <p className="mb-6 dark:text-gray-300">Выполните следующие упражнения, чтобы попрактиковаться в письме на английском языке.</p>
              <div className="space-y-6">
                {currentModule.content?.practiceExercises?.map((exercise, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-duolingo-gray dark:bg-gray-600 dark:border-gray-500">
                    <p className="font-medium mb-3 dark:text-white">Упражнение {index + 1}: {exercise}</p>
                    <textarea
                      className="w-full p-3 border rounded-md resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={4}
                      placeholder="Напишите свой ответ здесь..."
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
                Назад к урокам
              </Button>
              <Button onClick={handlePracticeSubmit} disabled={moduleCompleted}>
                {moduleCompleted ? 'Завершено!' : 'Отправить упражнения'}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Содержимое модуля</h1>
            <p className="dark:text-gray-300">Этот тип модуля пока недоступен.</p>
            <Button onClick={() => navigate('/lesson')} className="mt-4">
              Назад к урокам
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
