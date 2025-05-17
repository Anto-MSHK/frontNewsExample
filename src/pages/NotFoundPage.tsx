import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Страница не найдена
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          Запрашиваемая страница не существует или была перемещена.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
