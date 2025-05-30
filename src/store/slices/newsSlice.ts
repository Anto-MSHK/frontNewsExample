import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getNews,
  getNewsById,
  createNews as apiCreateNews,
  updateNews as apiUpdateNews,
  deleteNews as apiDeleteNews,
} from "../../api/newsApi";
import {
  NewsState,
  News,
  NewsFilters,
  CreateNewsRequest,
  UpdateNewsRequest,
} from "../../types";

// Асинхронные экшены
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({
    filters,
    rejectWithValue,
  }: {
    filters?: NewsFilters;
    rejectWithValue: any;
  }) => {
    try {
      const news = await getNews(filters);
      return news;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (id: any, { rejectWithValue }) => {
    try {
      const news = await getNewsById(id);
      return news;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

export const createNews = createAsyncThunk(
  "news/createNews",
  async (newsData: CreateNewsRequest, { rejectWithValue }) => {
    try {
      const news = await apiCreateNews(newsData);
      return news;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create news"
      );
    }
  }
);

export const updateNews = createAsyncThunk(
  "news/updateNews",
  async (
    { id, data }: { id: number; data: UpdateNewsRequest },
    { rejectWithValue }
  ) => {
    try {
      const news = await apiUpdateNews(id, data);
      return news;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update news"
      );
    }
  }
);

export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteNews(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete news"
      );
    }
  }
);

const initialState: NewsState = {
  items: [],
  currentNews: null,
  loading: false,
  error: null,
  filters: {},
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<NewsFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение списка новостей
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<News[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Получение новости по ID
      .addCase(fetchNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNewsById.fulfilled,
        (state, action: PayloadAction<News>) => {
          state.loading = false;
          state.currentNews = action.payload;
        }
      )
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Создание новости
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action: PayloadAction<News>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обновление новости
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action: PayloadAction<News>) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentNews?.id === action.payload.id) {
          state.currentNews = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Удаление новости
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentNews?.id === action.payload) {
          state.currentNews = null;
        }
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearCurrentNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
