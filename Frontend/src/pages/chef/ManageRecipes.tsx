import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
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
} from "../../components/ui/alert-dialog";
import {
  deleteChefRecipe,
  getChefRecipeById,
  getChefRecipes,
  updateChefRecipe,
} from "../../services/chefServices";
import { toast } from "sonner";

export default function ManageRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getChefRecipes();
      setRecipes(data);
    } catch (error) {
      toast.error("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(
      (recipe) =>
        recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [recipes, searchTerm]);

  const handleDelete = async (recipeId: number | string) => {
    try {
      setDeletingId(recipeId);
      await deleteChefRecipe(recipeId);
      toast.success("Recipe deleted successfully");
      await loadRecipes();
    } catch (error) {
      toast.error("Failed to delete recipe");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = async (recipeId: number | string) => {
    try {
      setIsEditOpen(true);
      setEditLoading(true);
      setEditingId(recipeId);

      const recipe = await getChefRecipeById(recipeId);
      setTitle(recipe?.title || "");
      setDescription(recipe?.description || "");
      setCategory(recipe?.category || "");
      setDifficulty(recipe?.difficulty || "");
      setCookTime(String(recipe?.cook_time || ""));
      setServings(String(recipe?.servings || ""));
      setImageUrl(recipe?.image_url || recipe?.image || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to load recipe");
      setIsEditOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    if (!category || !difficulty) {
      toast.error("Please select category and difficulty");
      return;
    }

    try {
      setEditSaving(true);
      await updateChefRecipe(editingId, {
        title,
        description,
        image_url: imageUrl,
        category,
        difficulty,
        cook_time: Number(cookTime),
        servings: Number(servings),
      });

      toast.success("Recipe updated successfully");
      setIsEditOpen(false);
      setEditingId(null);
      await loadRecipes();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update recipe");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl mb-2">Manage Recipes</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove recipes from your collection
          </p>
        </div>
        <Button asChild>
          <Link to="/manage-recipes/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Link>
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading recipes...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe.image || recipe.image_url}
                      alt={recipe.title}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {recipe.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(recipe.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deletingId === recipe.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Recipe?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {recipe.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(recipe.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{recipe.category}</Badge>
                        <span>{recipe.cook_time} min</span>
                        <span>•</span>
                        <span>{recipe.servings} servings</span>
                        <span>•</span>
                        <Badge
                          variant={
                            recipe.difficulty === "Easy"
                              ? "secondary"
                              : recipe.difficulty === "Medium"
                                ? "default"
                                : "destructive"
                          }
                        >
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
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>
              Update recipe details without leaving this page.
            </DialogDescription>
          </DialogHeader>

          {editLoading ? (
            <div className="py-10 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading recipe...
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select
                    value={difficulty}
                    onValueChange={setDifficulty}
                    required
                  >
                    <SelectTrigger id="edit-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cook-time">Cook Time (min)</Label>
                  <Input
                    id="edit-cook-time"
                    type="number"
                    min={1}
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-servings">Servings</Label>
                  <Input
                    id="edit-servings"
                    type="number"
                    min={1}
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={editSaving}>
                  {editSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
