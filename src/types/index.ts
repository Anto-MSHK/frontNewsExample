// Типы пользователей/ролей
export enum UserRole {
  Reader = "Reader",
  Author = "Author",
  Admin = "Admin",
}

// Типы для API
export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  agencyId?: number;
  agency?: Agency;
}

export interface Agency {
  id: number;
  name: string;
  description?: string;
  users?: User[];
}

export interface Category {
  id: number;
  name: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: number;
  agencyId: number;
  categoryId: number;
  author?: User;
  agency?: Agency;
  category?: Category;
}

// Типы для запросов
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  role?: UserRole;
  agencyId?: number;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterResponse {
  accessToken: string;
}

export interface NewsFilters {
  categoryId?: number;
  agencyId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  publishedAt?: string | null;
  categoryId: number;
  authorId?: number;
  agencyId?: number;
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
  publishedAt?: string | null;
  categoryId?: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface CreateAgencyRequest {
  name: string;
  description?: string;
}

export interface UpdateAgencyRequest {
  name?: string;
  description?: string;
}

// Типы для Redux
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface NewsState {
  items: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;
  filters: NewsFilters;
}

export interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

export interface AgencyState {
  items: Agency[];
  currentAgency: Agency | null;
  loading: boolean;
  error: string | null;
}

export interface UiState {
  notification: {
    open: boolean;
    message: string;
    type: "success" | "info" | "warning" | "error";
  };
}
