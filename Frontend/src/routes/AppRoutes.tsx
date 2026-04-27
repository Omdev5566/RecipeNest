import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Signup";
import ChefProfile from "../pages/chef/ChefProfile";
import Dashboard from "../pages/chef/Dashboard";
import ManageCategories from "../pages/chef/ManageCategories";
import ManageRecipes from "../pages/chef/ManageRecipes";
import AddRecipe from "../pages/chef/AddRecipe";
import EditRecipe from "../pages/chef/EditRecipe";

import Profile from "../pages/userprofile/UserProfile";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import ChefLayout from "../layouts/ChefLayout";
import RecipeDetail from "../pages/RecipeDetail";
import Bookmarks from "../pages/Bookmarks";
import AllUsersProfile from "../pages/AllUsersProfile";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRecipes from "../pages/admin/AdminRecipes";
import AdminComments from "../pages/admin/AdminComments";

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
          <ProtectedRoute allowedRoles={["user"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetail />,
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />,
      },
      {
        path: "/users/:id",
        element: (
          <ProtectedRoute>
            <AllUsersProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["chef", "admin"]}>
        <ChefLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/chef",
        element: <ChefProfile />,
      },
      {
        path: "/manage-recipes",
        element: <ManageRecipes />,
      },
      {
        path: "/manage-recipes/add",
        element: <AddRecipe />,
      },
      {
        path: "/manage-recipes/edit/:id",
        element: <EditRecipe />,
      },
      {
        path: "/manage-categories",
        element: <ManageCategories />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/recipes",
        element: <AdminRecipes />,
      },
      {
        path: "/admin/comments",
        element: <AdminComments />,
      },
    ],
  },
]);
