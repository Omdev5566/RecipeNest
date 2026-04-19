import { useParams, useNavigate } from 'react-router';
import { recipes } from '../data/mockData';
import { UserNavbar } from '../components/UserNavbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Clock, Users, ChefHat, ArrowLeft, Bookmark, BookmarkCheck, MessageSquare, ThumbsUp, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock comments data
interface Comment {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    date: '2 days ago',
    rating: 5,
    text: 'Absolutely delicious! I made this for my family dinner and everyone loved it. The instructions were clear and easy to follow. Will definitely make this again!',
    likes: 12
  },
  {
    id: '2',
    author: 'Michael Chen',
    date: '5 days ago',
    rating: 4,
    text: 'Great recipe! I substituted some ingredients based on what I had available and it still turned out fantastic. Thanks for sharing!',
    likes: 8
  },
  {
    id: '3',
    author: 'Emma Williams',
    date: '1 week ago',
    rating: 5,
    text: 'This has become my go-to recipe! Perfect for weeknight dinners. My kids ask for this at least once a week now.',
    likes: 15
  },
];

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl mb-4">Recipe not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl mb-2">{recipe.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{recipe.description}</p>
              </div>
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                size="icon"
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
                }}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{recipe.category}</Badge>
              <Badge variant={
                recipe.difficulty === 'Easy' ? 'secondary' : 
                recipe.difficulty === 'Medium' ? 'default' : 
                'destructive'
              }>
                {recipe.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cook Time</p>
                  <p className="font-medium">{recipe.cookTime} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Chef</p>
                  <p className="font-medium">{recipe.chef}</p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <p className="pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews & Comments ({mockComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your experience with this recipe..."
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rate this recipe:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => toast.success('Comment posted!')}>
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comments List */}
            <div className="space-y-6">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{comment.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < comment.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{comment.text}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2"
                        onClick={() => toast.success('Liked!')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockComments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your experience!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}