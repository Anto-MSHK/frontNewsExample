import api from "./axios";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (
  category: CreateCategoryRequest
): Promise<Category> => {
  try {
    const response = await api.post<Category>("/categories", category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  category: UpdateCategoryRequest
): Promise<Category> => {
  try {
    const response = await api.patch<Category>(`/categories/${id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    throw error;
  }
};
