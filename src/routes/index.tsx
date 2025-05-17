import { createBrowserRouter } from "react-router-dom";
import { UserRole } from "../types";
import PrivateRoute from "./PrivateRoute";

import AdminCategoriesPage from "../pages/admin/CategoriesPage";
import LoginPage from "../pages/LoginPage";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import NewsDetailPage from "../pages/NewsDetailPage";
import ProfilePage from "../pages/ProfilePage";
import AgencyNewsPage from "../pages/AgencyNewsPage";
import NewsEditorPage from "../pages/NewsEditorPage";
import NotFoundPage from "../pages/NotFoundPage";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "news/:id",
        element: <NewsDetailPage />,
      },
      {
        // Защищенные маршруты для авторизованных пользователей
        element: <PrivateRoute />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        // Защищенные маршруты для Авторов и Админов
        element: (
          <PrivateRoute allowedRoles={[UserRole.Author, UserRole.Admin]} />
        ),
        children: [
          {
            path: "agency/news",
            element: <AgencyNewsPage />,
          },
          {
            path: "news/editor",
            element: <NewsEditorPage />,
          },
          {
            path: "news/editor/:id",
            element: <NewsEditorPage />,
          },
        ],
      },
      {
        // Защищенные маршруты только для Администраторов
        element: <PrivateRoute allowedRoles={[UserRole.Admin]} />,
        children: [
          {
            path: "admin/categories",
            element: <AdminCategoriesPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
