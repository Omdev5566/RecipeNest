import { Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
            <Badge variant={
              recipe.difficulty === 'Easy' ? 'secondary' : 
              recipe.difficulty === 'Medium' ? 'default' : 
              'destructive'
            }>
              {recipe.difficulty}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className="line-clamp-1">{recipe.chef}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
