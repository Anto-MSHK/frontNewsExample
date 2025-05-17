import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchNews, setFilters } from "../store/slices/newsSlice";
import { fetchAgencies } from "../store/slices/agencySlice";
import NewsCard from "../components/NewsCard";
import NewsFilter from "../components/NewsFilter";
import { UserRole } from "../types";

const ITEMS_PER_PAGE = 9;

const AgencyNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    items: news,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.news);
  const { items: agencies } = useAppSelector((state) => state.agencies);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedAgencyId, setSelectedAgencyId] = useState<number | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [paginatedNews, setPaginatedNews] = useState(news);

  const isAdmin = user?.role === UserRole.Admin;

  // При монтировании компонента загружаем агентства (для админов) и новости
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAgencies());
    }

    // Если пользователь - автор, устанавливаем фильтр по его агентству
    if (user?.role === UserRole.Author && user?.agencyId) {
      if (!selectedAgencyId) {
        setSelectedAgencyId(user.agencyId);
      }
      dispatch(fetchNews({ ...filters, agencyId: user.agencyId } as any));
    } else if (isAdmin) {
      dispatch(fetchNews({ ...filters, agencyId: selectedAgencyId } as any));
    }
  }, [dispatch, user, isAdmin, filters, selectedAgencyId]);

  // Обновляем пагинированные новости при изменении данных или страницы
  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    setPaginatedNews(news.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [news, page]);

  // Обработчик изменения выбранного агентства (для админов)
  const handleAgencyChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    setSelectedAgencyId(value === "" ? undefined : Number(value));
    setPage(1);
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: any) => {
    // Для автора всегда добавляем фильтр по его агентству
    if (user?.role === UserRole.Author && user?.agencyId) {
      dispatch(setFilters({ ...newFilters, agencyId: user.agencyId }));
    } else {
      dispatch(setFilters({ ...newFilters, agencyId: selectedAgencyId }));
    }
    setPage(1);
  };

  // Обработчик изменения страницы
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Переход на страницу создания новости
  const handleAddNews = () => {
    navigate("/news/editor");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, sm: 0 },
          }}
        >
          Новости агентства
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddNews}
        >
          Добавить новость
        </Button>
      </Box>

      {/* Выбор агентства для админов */}
      {isAdmin && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Выберите агентство
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="agency-select-label">Агентство</InputLabel>
            <Select
              labelId="agency-select-label"
              value={selectedAgencyId || ""}
              onChange={handleAgencyChange}
              label="Агентство"
            >
              <MenuItem value="">
                <em>Все агентства</em>
              </MenuItem>
              {agencies.map((agency) => (
                <MenuItem key={agency.id} value={agency.id}>
                  {agency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}

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
          Новости не найдены. Попробуйте изменить критерии поиска или добавьте
          новую новость.
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

export default AgencyNewsPage;
