import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchAgencies } from "../store/slices/agencySlice";
import { NewsFilters } from "../types";

interface NewsFilterProps {
  filters: NewsFilters;
  onFilterChange: (filters: NewsFilters) => void;
}

const NewsFilter: React.FC<NewsFilterProps> = ({ filters, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((state) => state.categories);
  const { items: agencies } = useAppSelector((state) => state.agencies);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | undefined>(
    filters.categoryId
  );
  const [agencyId, setAgencyId] = useState<number | undefined>(
    filters.agencyId
  );
  const [startDate, setStartDate] = useState<string>(
    filters.startDate ? filters.startDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState<string>(
    filters.endDate ? filters.endDate.split("T")[0] : ""
  );

  // Загружаем списки категорий и агентств при монтировании
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAgencies());
  }, [dispatch]);

  // Обновляем локальные состояния, если изменились внешние фильтры
  useEffect(() => {
    setCategoryId(filters.categoryId);
    setAgencyId(filters.agencyId);
    setStartDate(filters.startDate ? filters.startDate.split("T")[0] : "");
    setEndDate(filters.endDate ? filters.endDate.split("T")[0] : "");
  }, [filters]);

  const handleCategoryChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    setCategoryId(value === "" ? undefined : Number(value));
  };

  const handleAgencyChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    setAgencyId(value === "" ? undefined : Number(value));
  };

  const handleApplyFilters = () => {
    onFilterChange({
      categoryId,
      agencyId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const handleResetFilters = () => {
    setCategoryId(undefined);
    setAgencyId(undefined);
    setStartDate("");
    setEndDate("");
    setSearchTerm("");

    onFilterChange({});
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Поиск и фильтрация новостей
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Поле поиска */}
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Поиск по заголовкам"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите текст для поиска..."
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Фильтр по категории */}
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-filter-label">Категория</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryId || ""}
                onChange={handleCategoryChange}
                label="Категория"
              >
                <MenuItem value="">
                  <em>Все категории</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Фильтр по агентству */}
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="agency-filter-label">Агентство</InputLabel>
              <Select
                labelId="agency-filter-label"
                value={agencyId || ""}
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
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Фильтр по дате начала */}
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
            <TextField
              fullWidth
              label="Дата начала"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          {/* Фильтр по дате окончания */}
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
            <TextField
              fullWidth
              label="Дата окончания"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate || undefined,
              }}
            />
          </Box>
        </Box>
        {/* Кнопки управления */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button variant="outlined" onClick={handleResetFilters}>
              Сбросить
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              Применить фильтры
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsFilter;
