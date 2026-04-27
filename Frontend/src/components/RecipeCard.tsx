import { Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '../data/RecipeModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Link, useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe & { chef_id?: number | string };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/recipe/${recipe.id}`);
        }
      }}
    >
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.image_url}
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
              <span>{recipe.cook_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              {recipe.chef_id ? (
                <Link
                  to={`/users/${recipe.chef_id}`}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  className="line-clamp-1 hover:underline"
                >
                  {recipe.chef_name}
                </Link>
              ) : (
                <span className="line-clamp-1">{recipe.chef_name}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
