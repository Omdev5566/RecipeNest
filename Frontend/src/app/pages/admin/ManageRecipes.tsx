import { useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { recipes } from '../../data/mockData';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

export function ManageRecipes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Manage Recipes</h1>
            <p className="text-muted-foreground">Add, edit, or remove recipes from your collection</p>
          </div>
          <Button asChild>
            <Link to="/admin/recipes/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Recipe List */}
        <div className="space-y-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <Card key={recipe.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {recipe.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{recipe.category}</Badge>
                        <span>Chef: {recipe.chef}</span>
                        <span>•</span>
                        <span>{recipe.cookTime} min</span>
                        <span>•</span>
                        <span>{recipe.servings} servings</span>
                        <span>•</span>
                        <Badge variant={
                          recipe.difficulty === 'Easy' ? 'secondary' :
                          recipe.difficulty === 'Medium' ? 'default' :
                          'destructive'
                        }>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recipes found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
