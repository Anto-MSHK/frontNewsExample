import { jwtDecode } from "jwt-decode";
import api from "./axios";
import { LoginRequest, LoginResponse, User } from "../types";

export const login = async (
  credentials: LoginRequest
): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    const token = response.data.accessToken;

    // Сохраняем токен в localStorage
    localStorage.setItem("token", token);

    // Декодируем JWT для получения данных пользователя
    const decodedToken = jwtDecode<{
      id: number;
      username: string;
      role: string;
      agencyId?: number;
      exp: number;
    }>(token);

    // Создаем объект пользователя из данных токена
    const user: User = {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role as any, // Приводим к типу UserRole
      agencyId: decodedToken.agencyId,
    };

    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
