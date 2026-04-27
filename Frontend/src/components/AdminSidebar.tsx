import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ChefHat, MessageSquare, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useAuth } from "../context/AuthContext";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/recipes", label: "Manage Recipes", icon: ChefHat },
    { to: "/admin/comments", label: "Manage Comments", icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">AdminPanel</h2>
        <p className="text-sm text-muted-foreground">System Management</p>
      </div>

      <nav className="space-y-1 mb-6">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/admin" && location.pathname.startsWith(link.to));

          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to RecipeNest
          </Link>
        </Button>
        <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
