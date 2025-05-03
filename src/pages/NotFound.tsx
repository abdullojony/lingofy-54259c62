
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Ошибка: Пользователь попытался получить доступ к несуществующему маршруту:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 mb-4 dark:text-gray-300">Упс! Страница не найдена</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300">
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
