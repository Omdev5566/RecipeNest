import { UserNavbar } from '../components/UserNavbar';
import { BookmarkX, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';

export function Bookmarks() {
  // In a real app, this would fetch bookmarked recipes from state/database
  const bookmarkedRecipes = [];

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">My Bookmarks</h1>
          <p className="text-muted-foreground">
            Your saved recipes for quick access and meal planning
          </p>
        </div>

        {bookmarkedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Recipe cards would go here */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <div className="relative mb-6">
              <BookmarkX className="h-20 w-20 text-muted-foreground" />
              <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2" />
            </div>
            <h2 className="text-2xl mb-3">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring recipes and bookmark your favorites to build your personal collection! 
              Click the bookmark icon on any recipe to save it here.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                Discover Recipes
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}