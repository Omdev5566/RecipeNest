import { createBrowserRouter } from "react-router-dom";

// Pages
import Home from '../pages/Home';
import RecipeDetail from '../pages/RecipeDetail';
import Bookmarks from '../pages/Bookmarks';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import FoodLoverProfile from '../pages/FoodLoverProfile';

// Admin
import Dashboard from '../pages/admin/Dashboard';
import ChefProfile from '../pages/ChefProfile';
import ManageRecipes from '../pages/admin/ManageRecipes';
import AddRecipe from '../pages/admin/AddRecipe';
import ManageCategories from '../pages/admin/ManageCategories';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Routes
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  
  {
    element: <MainLayout />, // ✅ shared layout
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/recipe/:id',
        element: <RecipeDetail />,
      },
      {
        path: '/bookmarks',
        element: (
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <FoodLoverProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Auth routes (no layout)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Signup />,
  },

  // Admin (you can later add AdminLayout)
  {
    path: '/admin',
    element: <Dashboard />,
  },
  {
    path: '/admin/profile',
    element: <ChefProfile />,
  },
  {
    path: '/admin/recipes',
    element: <ManageRecipes />,
  },
  {
    path: '/admin/recipes/add',
    element: <AddRecipe />,
  },
  {
    path: '/admin/categories',
    element: <ManageCategories />,
  },
]);