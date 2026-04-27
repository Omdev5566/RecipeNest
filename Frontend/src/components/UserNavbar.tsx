import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Bookmark,
  Home,
  LogIn,
  User,
  LayoutDashboardIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

interface UserNavbarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export function UserNavbar({ searchTerm, onSearchChange }: UserNavbarProps) {
  const location = useLocation(); // ✅ always call hooks first
  const { user, loading } = useAuth(); // ✅ always called in same order

  if (loading) {
    return null; // ✅ safe AFTER hooks
  }
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">RecipeNest</span>
          </Link>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes by title, ingredient, or chef..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.role == "chef" ? (
              <Button
                variant={location.pathname === "/chef" ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/dashboard">
                  <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : null}
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Discover
              </Link>
            </Button>

            <Button
              variant={location.pathname === "/bookmarks" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/bookmarks">
                <Bookmark className="h-4 w-4 mr-2" />
                My Bookmarks
              </Link>
            </Button>
            {user ? (
              <Button
                variant={location.pathname === "/profile" ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/profile" className="flex items-center">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                </Link>
              </Button>
            ) : !user ? (
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ChefHat({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" x2="18" y1="17" y2="17" />
    </svg>
  );
}
