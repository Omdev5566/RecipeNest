import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
