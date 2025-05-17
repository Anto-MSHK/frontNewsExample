import axios from "axios";

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Замените на реальный URL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик запросов для добавления токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Обработка ошибки авторизации (401 статус)
    if (error.response && error.response.status === 401) {
      // Очистка хранилища и перенаправление на страницу входа
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
