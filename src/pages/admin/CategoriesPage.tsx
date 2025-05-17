import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../store/slices/categorySlice";
import { showNotification } from "../../store/slices/uiSlice";
import { Category } from "../../types";

enum DialogMode {
  None,
  Create,
  Edit,
  Delete,
}

const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading,
    error,
  } = useAppSelector((state) => state.categories);

  // Состояния для модального окна
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.None);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [nameError, setNameError] = useState("");

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Открытие диалога создания категории
  const handleOpenCreateDialog = () => {
    setDialogMode(DialogMode.Create);
    setSelectedCategory(null);
    setCategoryName("");
    setNameError("");
  };

  // Открытие диалога редактирования категории
  const handleOpenEditDialog = (category: Category) => {
    setDialogMode(DialogMode.Edit);
    setSelectedCategory(category);
    setCategoryName(category.name);
    setNameError("");
  };

  // Открытие диалога удаления категории
  const handleOpenDeleteDialog = (category: Category) => {
    setDialogMode(DialogMode.Delete);
    setSelectedCategory(category);
  };

  // Закрытие диалога
  const handleCloseDialog = () => {
    setDialogMode(DialogMode.None);
    setSelectedCategory(null);
    setCategoryName("");
  };

  // Валидация формы
  const validateForm = () => {
    setNameError("");
    if (!categoryName.trim()) {
      setNameError("Название категории обязательно");
      return false;
    }
    return true;
  };

  // Обработчик сохранения категории (создание или редактирование)
  const handleSaveCategory = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (dialogMode === DialogMode.Create) {
        // Создаем новую категорию
        await dispatch(createCategory({ name: categoryName.trim() })).unwrap();
        dispatch(
          showNotification({
            message: "Категория успешно создана",
            type: "success",
          })
        );
      } else if (dialogMode === DialogMode.Edit && selectedCategory) {
        // Обновляем существующую категорию
        await dispatch(
          updateCategory({
            id: selectedCategory.id,
            data: { name: categoryName.trim() },
          })
        ).unwrap();
        dispatch(
          showNotification({
            message: "Категория успешно обновлена",
            type: "success",
          })
        );
      }

      handleCloseDialog();
    } catch (error: any) {
      console.error("Ошибка при сохранении категории:", error);

      // Проверка на ошибку конфликта (уже существует категория с таким именем)
      if (error.response?.status === 409) {
        setNameError("Категория с таким названием уже существует");
      } else {
        dispatch(
          showNotification({
            message: error.message || "Ошибка при сохранении категории",
            type: "error",
          })
        );
      }
    }
  };

  // Обработчик удаления категории
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await dispatch(deleteCategory(selectedCategory.id)).unwrap();
      dispatch(
        showNotification({
          message: "Категория успешно удалена",
          type: "success",
        })
      );
      handleCloseDialog();
    } catch (error: any) {
      console.error("Ошибка при удалении категории:", error);
      dispatch(
        showNotification({
          message: error.message || "Ошибка при удалении категории",
          type: "error",
        })
      );
    }
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
            Управление категориями
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
          >
            Добавить категорию
          </Button>
        </Box>

        {/* Отображаем ошибку, если есть */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Таблица категорий */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Название</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Нет доступных категорий
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(category)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(category)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Диалог для создания/редактирования категории */}
      <Dialog
        open={
          dialogMode === DialogMode.Create || dialogMode === DialogMode.Edit
        }
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {dialogMode === DialogMode.Create
            ? "Создать новую категорию"
            : "Изменить категорию"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название категории"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            {dialogMode === DialogMode.Create ? "Создать" : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={dialogMode === DialogMode.Delete}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"?
            Это действие нельзя будет отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleDeleteCategory} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCategoriesPage;
