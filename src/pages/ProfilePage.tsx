import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { Person, Business, Email } from "@mui/icons-material";
import { useAppSelector } from "../hooks/redux";
import { UserRole } from "../types";

// Компонент для отображения роли пользователя
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  // Выбираем цвет в зависимости от роли
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";

  switch (role) {
    case UserRole.Admin:
      color = "error";
      break;
    case UserRole.Author:
      color = "primary";
      break;
    case UserRole.Reader:
      color = "info";
      break;
    default:
      color = "default";
  }

  return <Chip label={role} color={color} sx={{ fontWeight: "bold" }} />;
};

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Если по какой-то причине user не определен, показываем сообщение
  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography
          variant="h5"
          color="error"
          sx={{ textAlign: "center", my: 4 }}
        >
          Не удалось загрузить профиль пользователя
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Ваш профиль
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 3,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2rem",
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {user.username}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <RoleBadge role={user.role as UserRole} />
            </Box>

            {user.email && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Информация профиля
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            mx: -1, // Corresponds to half of spacing={2} (theme.spacing(1))
          }}
        >
          <Box
            sx={{
              p: 1, // Corresponds to half of spacing={2}
              width: { xs: "100%", sm: "50%" },
              boxSizing: "border-box",
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Person sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Пользователь
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ID пользователя:
                </Typography>
                <Typography variant="body1">{user.id}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Имя пользователя:
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Роль:
                </Typography>
                <Typography variant="body1">{user.role}</Typography>
              </Box>
            </Paper>
          </Box>

          <Box
            sx={{
              p: 1, // Corresponds to half of spacing={2}
              width: { xs: "100%", sm: "50%" },
              boxSizing: "border-box",
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Business sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Агентство
                </Typography>
              </Box>

              {user.agencyId ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ID агентства:
                  </Typography>
                  <Typography variant="body1">{user.agencyId}</Typography>

                  {user.agency && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Название агентства:
                      </Typography>
                      <Typography variant="body1">
                        {user.agency.name}
                      </Typography>

                      {user.agency.description && (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Описание:
                          </Typography>
                          <Typography variant="body1">
                            {user.agency.description}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Пользователь не связан с агентством
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
