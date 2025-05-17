import React, { useState } from "react";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Article,
  Home,
  Assignment,
  Category,
  Business,
  Person,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { logoutUser } from "../store/slices/authSlice";
import { showNotification } from "../store/slices/uiSlice";
import { UserRole } from "../types";
import Notification from "./Notification";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Состояния для меню пользователя и бокового меню
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      dispatch(
        showNotification({
          message: "Вы успешно вышли из системы",
          type: "success",
        })
      );
      navigate("/login");
    });
    handleCloseUserMenu();
  };

  // Функция для проверки, имеет ли текущий пользователь указанную роль
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    return Array.isArray(roles)
      ? roles.includes(user.role as UserRole)
      : user.role === roles;
  };

  // Элементы бокового меню
  const drawerItems = [
    { text: "Главная", icon: <Home />, link: "/", roles: [] },
    {
      text: "Новости агентства",
      icon: <Article />,
      link: "/agency/news",
      roles: [UserRole.Author, UserRole.Admin],
    },
    { text: "Профиль", icon: <Person />, link: "/profile", roles: [] },
    {
      text: "Редактор новостей",
      icon: <Assignment />,
      link: "/news/editor",
      roles: [UserRole.Author, UserRole.Admin],
    },
    {
      text: "Управление категориями",
      icon: <Category />,
      link: "/admin/categories",
      roles: [UserRole.Admin],
    },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Новостное приложение
        </Typography>
      </Box>
      <Divider />
      <List>
        {drawerItems.map(
          (item) =>
            // Отображаем пункты меню в зависимости от роли пользователя
            (item.roles.length === 0 || (user && hasRole(item.roles))) && (
              <ListItem
                component={RouterLink}
                to={item.link}
                key={item.text}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              НОВОСТИ
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Меню пользователя */}
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign="center">Профиль</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Выйти</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button component={RouterLink} to="/login" color="inherit">
                  Войти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Боковая панель навигации */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>

      {/* Компонент уведомлений */}
      <Notification />
    </>
  );
};

export default Layout;
