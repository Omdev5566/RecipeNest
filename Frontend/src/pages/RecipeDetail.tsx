import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "../services/recipesService"; // adjust path if needed
import {
  addComment as addCommentRequest,
  getCommentsByRecipe,
  toggleCommentLike as toggleCommentLikeRequest,
} from "../services/commentsService";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  ThumbsUp,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarks, toggleBookmark } from "../services/userService";

import { Comment } from "../data/CommentModel";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["recipe-comments", id],
    queryFn: async () => {
      const res = await getCommentsByRecipe(id, user?.id);
      return res.data;
    },
    enabled: Boolean(id),
    refetchInterval: 4000,
  });

  const addCommentMutation = useMutation({
    mutationFn: async () =>
      addCommentRequest({
        recipe_id: id,
        comment: commentText.trim(),
        rating,
      }),
    onSuccess: () => {
      toast.success("Comment posted!");
      setCommentText("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["recipe-comments", id] });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to post comment";
      toast.error(message);
    },
  });

  const likeMutation = useMutation({
    mutationFn: (commentId: number) => toggleCommentLikeRequest(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe-comments", id] });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to update like";
      toast.error(message);
    },
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await getRecipeById(id);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  useEffect(() => {
    const loadBookmarkState = async () => {
      if (!id || !user?.id) {
        setIsBookmarked(false);
        return;
      }

      try {
        const res = await getBookmarks();
        const bookmarks = res.data?.data || [];
        setIsBookmarked(bookmarks.some((item: any) => String(item.id) === String(id)));
      } catch {
        setIsBookmarked(false);
      }
    };

    loadBookmarkState();
  }, [id, user?.id]);

  if (loading) {
    return <div className="p-10 text-center">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl mb-4">Recipe not found</h1>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const handlePostComment = () => {
    if (!user) {
      toast.error("Please login to post comments");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    addCommentMutation.mutate();
  };

  const handleToggleLike = (commentId: number) => {
    if (!user) {
      toast.error("Please login to like comments");
      navigate("/login");
      return;
    }

    likeMutation.mutate(commentId);
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error("Please login to save bookmarks");
      navigate("/login");
      return;
    }

    if (!id) return;

    try {
      const res = await toggleBookmark(id);
      const bookmarked = Boolean(res.data?.data?.bookmarked);
      setIsBookmarked(bookmarked);
      toast.success(res.data?.message || (bookmarked ? "Added to bookmarks" : "Removed from bookmarks"));
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update bookmark";
      toast.error(message);
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Recipes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl mb-2">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {recipe.description}
              </p>
            </div>

            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="icon"
              onClick={handleToggleBookmark}
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
            <Badge>{recipe.difficulty}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <div>
                <p className="text-sm">Cook Time</p>
                <p className="font-medium">{recipe.cook_time} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <p className="text-sm">Servings</p>
                <p className="font-medium">{recipe.servings}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <div>
                <p className="text-sm">Chef</p>
                {recipe.chef_id ? (
                  <Link to={`/users/${recipe.chef_id}`} className="font-medium hover:underline">
                    {recipe.chef_name}
                  </Link>
                ) : (
                  <p className="font-medium">{recipe.chef_name}</p>
                )}
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
                {recipe.ingredients?.map((ing: string, i: number) => (
                  <li key={i}>• {ing}</li>
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
            {recipe.instructions?.map((step: any, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {i + 1}
                </span>
                <p>{step.instruction}</p>
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
            Reviews & Comments ({comments.length})
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
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rate this recipe:
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground hover:text-yellow-500"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handlePostComment} disabled={addCommentMutation.isPending}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{comment.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < comment.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
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
                      onClick={() => handleToggleLike(comment.id)}
                      disabled={likeMutation.isPending}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${comment.liked_by_me ? "fill-primary text-primary" : ""}`}
                      />
                      <span>{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to share your experience!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
