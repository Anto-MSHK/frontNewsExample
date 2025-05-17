import api from "./axios";
import {
  News,
  NewsFilters,
  CreateNewsRequest,
  UpdateNewsRequest,
} from "../types";

export const getNews = async (filters?: NewsFilters): Promise<News[]> => {
  try {
    const params = {
      categoryId: filters?.categoryId,
      agencyId: filters?.agencyId,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    };

    // Удаляем все undefined значения из params
    Object.keys(params).forEach((key) => {
      if (params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    const response = await api.get<News[]>("/news", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewsById = async (id: number): Promise<News> => {
  try {
    const response = await api.get<News>(`/news/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNews = async (news: CreateNewsRequest): Promise<News> => {
  try {
    const response = await api.post<News>("/news", news);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNews = async (
  id: number,
  news: UpdateNewsRequest
): Promise<News> => {
  try {
    const response = await api.patch<News>(`/news/${id}`, news);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNews = async (id: number): Promise<void> => {
  try {
    await api.delete(`/news/${id}`);
  } catch (error) {
    throw error;
  }
};
