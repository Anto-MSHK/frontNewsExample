import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  FormHelperText,
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchNewsById,
  clearCurrentNews,
  createNews,
  updateNews,
} from "../store/slices/newsSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchAgencies } from "../store/slices/agencySlice";
import { showNotification } from "../store/slices/uiSlice";
import { UserRole, CreateNewsRequest, UpdateNewsRequest } from "../types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const NewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentNews, loading, error } = useAppSelector((state) => state.news);
  const { items: categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );
  const { items: agencies, loading: agenciesLoading } = useAppSelector(
    (state) => state.agencies
  );
  const { user } = useAppSelector((state) => state.auth);

  const isEditMode = !!id;
  const isAdmin = user?.role === UserRole.Admin;

  // Состояние формы
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [authorId, setAuthorId] = useState<number | "">("");
  const [agencyId, setAgencyId] = useState<number | "">("");

  // Состояние для отслеживания ошибок валидации
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    categoryId: "",
    authorId: "",
    agencyId: "",
  });

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategories());

    if (isAdmin) {
      dispatch(fetchAgencies());
    }

    if (isEditMode && id) {
      dispatch(fetchNewsById(Number(id)));
    }

    // Очищаем при размонтировании
    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, id, isEditMode, isAdmin]);

  // При получении данных новости заполняем форму
  useEffect(() => {
    if (currentNews && isEditMode) {
      setTitle(currentNews.title);
      setContent(currentNews.content);
      setCategoryId(currentNews.categoryId);
      setPublishedAt(
        currentNews.publishedAt ? new Date(currentNews.publishedAt) : null
      );
      setAuthorId(currentNews.authorId || "");
      setAgencyId(currentNews.agencyId || "");
    } else if (!isEditMode && user) {
      // Для новой новости автоматически заполняем authorId и agencyId для авторов
      if (user.role === UserRole.Author) {
        setAuthorId(user.id);
        setAgencyId(user.agencyId || "");
      }
    }
  }, [currentNews, isEditMode, user]);

  // Валидация формы
  const validateForm = () => {
    const errors = {
      title: "",
      content: "",
      categoryId: "",
      authorId: "",
      agencyId: "",
    };
    let isValid = true;

    if (!title.trim()) {
      errors.title = "Название обязательно";
      isValid = false;
    }

    if (!content.trim()) {
      errors.content = "Содержание обязательно";
      isValid = false;
    }

    if (!categoryId) {
      errors.categoryId = "Выберите категорию";
      isValid = false;
    }

    if (isAdmin) {
      if (!authorId) {
        errors.authorId = "Укажите ID автора";
        isValid = false;
      }

      if (!agencyId) {
        errors.agencyId = "Укажите ID агентства";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      dispatch(
        showNotification({
          message: "Пожалуйста, заполните все обязательные поля",
          type: "error",
        })
      );
      return;
    }

    try {
      if (isEditMode && id) {
        // Обновление существующей новости
        const updateData: UpdateNewsRequest = {
          title,
          content,
          categoryId: categoryId as number,
          publishedAt: publishedAt ? publishedAt.toISOString() : null,
        };

        await dispatch(
          updateNews({ id: Number(id), data: updateData })
        ).unwrap();
        dispatch(
          showNotification({
            message: "Новость успешно обновлена",
            type: "success",
          })
        );

        navigate(`/news/${id}`);
      } else {
        // Создание новой новости
        const createData: CreateNewsRequest = {
          title,
          content,
          categoryId: categoryId as number,
          publishedAt: publishedAt ? publishedAt.toISOString() : null,
        };

        // Для админов добавляем authorId и agencyId
        if (isAdmin) {
          createData.authorId = authorId as number;
          createData.agencyId = agencyId as number;
        }

        const result = await dispatch(createNews(createData)).unwrap();
        dispatch(
          showNotification({
            message: "Новость успешно создана",
            type: "success",
          })
        );

        navigate(`/news/${result.id}`);
      }
    } catch (error: any) {
      console.error("Ошибка при сохранении новости:", error);
      dispatch(
        showNotification({
          message: error.message || "Ошибка при сохранении новости",
          type: "error",
        })
      );
    }
  };

  // Обработчик для кнопки "Отмена"
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            {isEditMode ? "Редактирование новости" : "Создание новости"}
          </Typography>

          <Button startIcon={<ArrowBack />} onClick={handleCancel}>
            Отмена
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading || categoriesLoading || agenciesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <TextField
                    label="Заголовок новости"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    required
                  />
                </Box>

                <Box>
                  <TextField
                    label="Содержание новости"
                    fullWidth
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    rows={12}
                    error={!!formErrors.content}
                    helperText={formErrors.content}
                    required
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={!!formErrors.categoryId}>
                      <InputLabel id="category-select-label">
                        Категория
                      </InputLabel>
                      <Select
                        labelId="category-select-label"
                        value={categoryId}
                        label="Категория"
                        onChange={(e) =>
                          setCategoryId(e.target.value as number)
                        }
                        required
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.categoryId && (
                        <FormHelperText>{formErrors.categoryId}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Дата публикации (опционально)"
                        value={publishedAt}
                        onChange={(date) => setPublishedAt(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            helperText: "Оставьте пустым для черновика",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>

                {/* Дополнительные поля для админа */}
                {isAdmin && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        label="ID автора"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={authorId}
                        onChange={(e) =>
                          setAuthorId(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        error={!!formErrors.authorId}
                        helperText={
                          formErrors.authorId ||
                          'Введите ID пользователя с ролью "Author"'
                        }
                        required
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth error={!!formErrors.agencyId}>
                        <InputLabel id="agency-select-label">
                          Агентство
                        </InputLabel>
                        <Select
                          labelId="agency-select-label"
                          value={agencyId}
                          label="Агентство"
                          onChange={(e) =>
                            setAgencyId(e.target.value as number)
                          }
                          required
                        >
                          {agencies.map((agency) => (
                            <MenuItem key={agency.id} value={agency.id}>
                              {agency.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors.agencyId && (
                          <FormHelperText>{formErrors.agencyId}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                )}

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {isEditMode ? "Сохранить изменения" : "Создать новость"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default NewsEditorPage;
