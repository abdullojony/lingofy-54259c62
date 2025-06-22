
export const languageModules: Record<string, any[]> = {
  "испанский": [
    {
      id: 1,
      title: "Основы испанского",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Испанский",
      content: {
        videoUrl: "https://www.youtube.com/embed/PIvrl8W_jh0",
        description: "Изучите основы испанской грамматики и произношения.",
        quizzes: [
          {
            id: 1,
            question: "Как сказать 'Привет' по-испански?",
            options: ["Hola", "Adiós", "Gracias", "Por favor"],
            correctAnswer: 0,
            timestamp: 30
          }
        ]
      }
    },
    {
      id: 2,
      title: "Испанские числа",
      type: "reading" as const,
      isCompleted: false,
      isActive: true,
      subject: "Испанский",
      content: {
        readingContent: [
          "Изучение чисел является основой изучения любого языка.",
          "## Числа от 1 до 10",
          "- **Uno** - Один",
          "- **Dos** - Два", 
          "- **Tres** - Три",
          "- **Cuatro** - Четыре",
          "- **Cinco** - Пять"
        ]
      }
    }
  ],
  "французский": [
    {
      id: 1,
      title: "Французский алфавит",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Французский"
    },
    {
      id: 2,
      title: "Основные фразы",
      type: "quiz" as const,
      isCompleted: false,
      isActive: true,
      subject: "Французский"
    }
  ],
  "японский": [
    {
      id: 1,
      title: "Хирагана",
      type: "reading" as const,
      isCompleted: false,
      isActive: true,
      subject: "Японский"
    },
    {
      id: 2,
      title: "Основные иероглифы",
      type: "practice" as const,
      isCompleted: false,
      isActive: true,
      subject: "Японский"
    }
  ],
  "немецкий": [
    {
      id: 1,
      title: "Немецкие артикли",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Немецкий"
    }
  ]
};

export const subjectModules: Record<string, any[]> = {
  "математика": [
    {
      id: 1,
      title: "Основы алгебры",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Математика",
      content: {
        videoUrl: "https://www.youtube.com/embed/PIvrl8W_jh0",
        description: "Изучите основы алгебраических выражений и уравнений.",
        quizzes: [
          {
            id: 1,
            question: "Что такое переменная в алгебре?",
            options: ["Number", "Variable", "Constant", "Expression"],
            correctAnswer: 1,
            timestamp: 45
          }
        ]
      }
    },
    {
      id: 2,
      title: "Геометрия",
      type: "reading" as const,
      isCompleted: false,
      isActive: true,
      subject: "Математика",
      content: {
        readingContent: [
          "Геометрия изучает формы, размеры и свойства фигур.",
          "## Основные фигуры",
          "- **Triangle** - Треугольник",
          "- **Square** - Квадрат",
          "- **Circle** - Круг"
        ]
      }
    }
  ],
  "программирование": [
    {
      id: 1,
      title: "Введение в Python",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Программирование"
    },
    {
      id: 2,
      title: "Основы JavaScript",
      type: "practice" as const,
      isCompleted: false,
      isActive: true,
      subject: "Программирование"
    }
  ],
  "наука": [
    {
      id: 1,
      title: "Физика: Силы",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "Наука"
    },
    {
      id: 2,
      title: "Химия: Элементы",
      type: "quiz" as const,
      isCompleted: false,
      isActive: true,
      subject: "Наука"
    }
  ],
  "история": [
    {
      id: 1,
      title: "Древний Рим",
      type: "reading" as const,
      isCompleted: false,
      isActive: true,
      subject: "История"
    },
    {
      id: 2,
      title: "Средневековье",
      type: "video" as const,
      isCompleted: false,
      isActive: true,
      subject: "История"
    }
  ]
};
