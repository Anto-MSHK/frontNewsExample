import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchNews, setFilters } from "../store/slices/newsSlice";
import NewsCard from "../components/NewsCard";
import NewsFilter from "../components/NewsFilter";
import { NewsFilters } from "../types";

const ITEMS_PER_PAGE = 9;

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: news,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.news);

  // Состояние для пагинации
  const [page, setPage] = useState(1);
  const [paginatedNews, setPaginatedNews] = useState(news);

  // При монтировании компонента загружаем данные
  useEffect(() => {
    dispatch(fetchNews(filters as any));
  }, [dispatch, filters]);

  // Обновляем пагинированные новости при изменении данных или страницы
  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    setPaginatedNews(news.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [news, page]);

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: NewsFilters) => {
    dispatch(setFilters(newFilters));
    setPage(1); // Сбрасываем страницу при изменении фильтров
  };

  // Обработчик изменения страницы
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Последние новости
      </Typography>

      {/* Компонент фильтрации */}
      <NewsFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Отображаем загрузку */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Отображаем ошибку, если есть */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Если новостей нет и нет загрузки, показываем сообщение */}
      {!loading && !error && news.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Новости не найдены. Попробуйте изменить критерии поиска.
        </Alert>
      )}

      {/* Отображаем список новостей */}
      {!loading && !error && news.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              mx: -1.5, // Corresponds to half of spacing={3} (theme.spacing(1.5))
            }}
          >
            {paginatedNews.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5, // Corresponds to half of spacing={3}
                  width: {
                    xs: "100%",
                    sm: "50%",
                    md: "33.3333%",
                  },
                  boxSizing: "border-box",
                }}
              >
                <NewsCard news={item} />
              </Box>
            ))}
          </Box>

          {/* Пагинация */}
          {news.length > ITEMS_PER_PAGE && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
            >
              <Pagination
                count={Math.ceil(news.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;
