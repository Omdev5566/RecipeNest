import { Link, useLocation } from 'react-router';
import { LayoutDashboard, ChefHat, FolderOpen, ArrowLeft, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

export function AdminSidebar() {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/profile', label: 'My Profile', icon: User },
    { to: '/admin/recipes', label: 'Manage Recipes', icon: ChefHat },
    { to: '/admin/categories', label: 'Manage Categories', icon: FolderOpen },
  ];

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">ChefPortal</h2>
        <p className="text-sm text-muted-foreground">Recipe Management System</p>
      </div>

      <nav className="space-y-1 mb-6">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Button variant="outline" size="sm" asChild className="w-full">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to RecipeNest
        </Link>
      </Button>
    </aside>
  );
}