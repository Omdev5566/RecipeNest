import { useEffect, useState } from 'react';
import { BookmarkX, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { getProfile } from '../services/userService';

type BookmarkedRecipe = {
  id: number;
  title: string;
  description: string;
  image: string;
  category?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cook_time: number;
  servings: number;
  chef_name: string;
};

export default function Bookmarks() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<BookmarkedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        const user = res.data?.data?.user;
        setBookmarkedRecipes(user?.bookmarked_recipes || []);
      } catch (error) {
        setBookmarkedRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading bookmarks...
        </div>
      </div>
    );
  }

  return (
    <>
        <div className="mb-8">
          <h1 className="text-4xl mb-2">My Bookmarks</h1>
          <p className="text-muted-foreground">
            Your saved recipes for quick access and meal planning
          </p>
        </div>

        {bookmarkedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe as never} />
            ))}
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
        </>
  );
}