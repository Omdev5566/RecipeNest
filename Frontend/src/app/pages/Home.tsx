import { useState, useMemo } from 'react';
import { recipes, categories } from '../data/mockData';
import { RecipeCard } from '../components/RecipeCard';
import { UserNavbar } from '../components/UserNavbar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Discover Delicious Recipes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore our curated collection of professional recipes from verified chefs around the world. 
            Find trusted, tested recipes with clear instructions and authentic culinary expertise.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>{recipes.length} Professional Recipes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>{categories.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Verified Chefs</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
            >
              All Recipes
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.recipeCount}
                </Badge>
              </Button>
            ))}
          </div>
        </section>

        {/* Recipe Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">
              {selectedCategory ? `${selectedCategory} Recipes` : 'All Recipes'}
            </h2>
            <p className="text-muted-foreground">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
            </p>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No recipes found. Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}