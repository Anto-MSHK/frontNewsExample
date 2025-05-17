import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Business,
  Category,
  ArrowBack,
  Edit,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchNewsById, clearCurrentNews } from "../store/slices/newsSlice";
import { UserRole } from "../types";

// Функция для форматирования даты
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Не опубликовано";

  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const newsId = Number(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentNews, loading, error } = useAppSelector((state) => state.news);
  const { user } = useAppSelector((state) => state.auth);

  // Загружаем данные новости при монтировании компонента
  useEffect(() => {
    if (newsId) {
      dispatch(fetchNewsById(newsId));
    }

    // Очищаем при размонтировании
    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, newsId]);

  // Проверяем права пользователя на редактирование
  const canEdit = (): boolean => {
    if (!user || !currentNews) return false;

    // Администратор может редактировать любую новость
    if (user.role === UserRole.Admin) return true;

    // Автор может редактировать только свои новости
    if (user.role === UserRole.Author && user.id === currentNews.authorId)
      return true;

    return false;
  };

  const handleEditClick = () => {
    navigate(`/news/editor/${newsId}`);
  };

  // Обработчик для кнопки "Назад"
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!currentNews) {
    return (
      <Alert severity="warning" sx={{ my: 4 }}>
        Новость не найдена
      </Alert>
    );
  }

  const { title, content, publishedAt, category, author, agency } = currentNews;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          {/* Заголовок */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>

            {canEdit() && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditClick}
              >
                Редактировать
              </Button>
            )}
          </Box>

          {/* Метаданные */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              p: 2,
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday
                fontSize="small"
                sx={{ mr: 1, color: "primary.main" }}
              />
              <Typography variant="body2">{formatDate(publishedAt)}</Typography>
            </Box>

            {author && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Person
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                <Typography variant="body2">{author.username}</Typography>
              </Box>
            )}

            {agency && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Business
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                <Typography variant="body2">{agency.name}</Typography>
              </Box>
            )}

            {category && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Category
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                <Chip label={category.name} size="small" color="primary" />
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Содержание новости */}
          <Box
            sx={{
              typography: "body1",
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            {/* Разбиваем текст на параграфы */}
            {content.split("\n").map((paragraph, index) => (
              <Typography
                key={index}
                paragraph={index !== content.split("\n").length - 1}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Информация об авторе и агентстве */}
        {(author || agency) && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            {author && (
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="h2">
                      Об авторе
                    </Typography>
                  </Box>
                  <Typography variant="body1">{author.username}</Typography>
                  {author.email && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Email: {author.email}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

            {agency && (
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Business sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="h2">
                      Об агентстве
                    </Typography>
                  </Box>
                  <Typography variant="body1">{agency.name}</Typography>
                  {agency.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {agency.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default NewsDetailPage;
