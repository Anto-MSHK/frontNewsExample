import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../../api/authApi";
import {
  AuthState,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from "../../types";
import { jwtDecode } from "jwt-decode";

// Асинхронный экшн для логина
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const result = await apiLogin(credentials);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка входа");
    }
  }
);

// Асинхронный экшн для регистрации
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const result = await apiRegister(userData);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка регистрации"
      );
    }
  }
);

// Асинхронный экшн для выхода из системы
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  apiLogout();
});

// Функция для проверки и загрузки данных пользователя из localStorage при инициализации
const loadUserFromStorage = (): { user: User | null; token: string | null } => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { user: null, token: null };
  }

  try {
    const decoded = jwtDecode<{
      id: number;
      username: string;
      role: string;
      agencyId?: number;
      exp: number;
    }>(token);

    // Проверяем, не истек ли срок действия токена
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return { user: null, token: null };
    }

    // Создаем объект пользователя из данных токена
    const user: User = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role as UserRole,
      agencyId: decoded.agencyId,
    };

    return { user, token };
  } catch (error) {
    localStorage.removeItem("token");
    return { user: null, token: null };
  }
};

// Начальное состояние с проверкой наличия данных в localStorage
const initialState: AuthState = {
  loading: false,
  error: null,
  ...loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage().token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка логина
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка входа";
      })
      // Обработка регистрации
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка регистрации";
      })
      // Обработка выхода
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
