
import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === undefined) {
      toast.error('Пожалуйста, выберите ответ');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      setShowResults(true);
      onComplete(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Результаты теста</h2>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-duolingo-green dark:text-green-400 mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-lg dark:text-gray-300">
            Вы правильно ответили на {score} из {questions.length} вопросов!
          </p>
        </div>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 bg-duolingo-light rounded-lg dark:bg-gray-700">
              <h3 className="font-bold mb-2 dark:text-white">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : selectedAnswers[index] === optionIndex
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {option}
                    {optionIndex === question.correctAnswer && ' ✓'}
                    {selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer && ' ✗'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold dark:text-white">
            Вопрос {currentQuestion + 1} из {questions.length}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Прогресс: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-duolingo-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-6 dark:text-white">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswers[currentQuestion] === index
                ? 'border-duolingo-blue bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            } dark:bg-gray-700 dark:text-white`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-duolingo-blue bg-duolingo-blue'
                  : 'border-gray-300 dark:border-gray-500'
              }`}>
                {selectedAnswers[currentQuestion] === index && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Назад
        </Button>
        <Button onClick={handleNext}>
          {currentQuestion === questions.length - 1 ? 'Завершить тест' : 'Далее'}
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
