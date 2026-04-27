import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminRecipe, getAdminRecipes } from "../../services/adminService";

export default function AdminRecipes() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAdminRecipes({ page, limit: 10, search });
      setRecipes(data?.recipes || []);
      setPagination(data?.pagination || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    loadRecipes();
  };

  const handleDelete = async (recipeId: number) => {
    try {
      await deleteAdminRecipe(recipeId);
      toast.success("Recipe deleted");
      loadRecipes();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete recipe");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Manage Recipes</h1>
        <p className="text-muted-foreground">Moderate platform recipes and remove invalid content.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="Search by title, category, chef"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={applyFilters}>Apply</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 flex justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border rounded-md p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="font-medium">{recipe.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {recipe.category} • {recipe.chef_name || "Unknown chef"}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(recipe.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              ))}

              {recipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recipes found.</p>
              ) : null}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!pagination?.hasPrev}
            >
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {pagination?.page || 1} of {pagination?.totalPages || 1}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination?.hasNext}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
