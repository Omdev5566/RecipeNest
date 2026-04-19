import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Signup";
import AdminDashboard from "../pages/admin/Dashboard";
import ChefDashboard from "../pages/ChefProfile";
import Profile from "../pages/FoodLoverProfile";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import RecipeDetail from "../pages/RecipeDetail";
import Bookmarks from "../pages/Bookmarks";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/recipes",
        element: <RecipeDetail />,
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />
      },
    ],
  },

  {
    path: "/chef",
    element: (
      <ProtectedRoute allowedRoles={["chef", "admin"]}>
        <ChefDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
