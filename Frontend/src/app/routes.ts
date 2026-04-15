import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { RecipeDetail } from './pages/RecipeDetail';
import { Bookmarks } from './pages/Bookmarks';
import { Login } from './pages/Login';
import { Register } from './pages/Signup';
import { FoodLoverProfile } from './pages/FoodLoverProfile';
import { Dashboard } from './pages/admin/Dashboard';
import { ChefProfile } from './pages/ChefProfile';
import { ManageRecipes } from './pages/admin/ManageRecipes';
import { AddRecipe } from './pages/admin/AddRecipe';
import { ManageCategories } from './pages/admin/ManageCategories';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/recipe/:id',
    Component: RecipeDetail,
  },
  {
    path: '/bookmarks',
    Component: Bookmarks,
  },
  {
    path: '/login',
    Component: Login,
  },
    {
    path: '/register',
    Component: Register,
  },
  {
    path: '/profile',
    Component: FoodLoverProfile,
  },
  {
    path: '/admin',
    Component: Dashboard,
  },
  {
    path: '/admin/profile',
    Component: ChefProfile,
  },
  {
    path: '/admin/recipes',
    Component: ManageRecipes,
  },
  {
    path: '/admin/recipes/add',
    Component: AddRecipe,
  },
  {
    path: '/admin/categories',
    Component: ManageCategories,
  },
]);