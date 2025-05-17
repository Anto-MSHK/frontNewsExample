import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
} from "@mui/material";
import { CalendarToday, Person, Business } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { News } from "../types";

interface NewsCardProps {
  news: News;
}

// Функция для сокращения текста
const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

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

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={`https://source.unsplash.com/random?news,article&sig=${news.id}`} // Placeholder изображение
        alt={news.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {news.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {truncateText(news.content)}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarToday
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary" }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(news.publishedAt)}
          </Typography>
        </Box>

        {news.author && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Person fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {news.author.username}
            </Typography>
          </Box>
        )}

        {news.agency && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Business
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="caption" color="text.secondary">
              {news.agency.name}
            </Typography>
          </Box>
        )}

        {news.category && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Chip
              label={news.category.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            component={RouterLink}
            to={`/news/${news.id}`}
            variant="contained"
            size="small"
            color="primary"
          >
            Читать дальше
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
