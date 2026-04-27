import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminComment, getAdminComments } from "../../services/adminService";

export default function AdminComments() {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getAdminComments({ page, limit: 10, search });
      setComments(data?.comments || []);
      setPagination(data?.pagination || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    loadComments();
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteAdminComment(commentId);
      toast.success("Comment deleted");
      loadComments();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Manage Comments</h1>
        <p className="text-muted-foreground">Review and remove inappropriate comments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="Search by comment, user, recipe"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={applyFilters}>Apply</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 flex justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-md p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{comment.text}</p>
                    <p className="text-sm text-muted-foreground">
                      {comment.user_name || "Unknown user"} • {comment.recipe_title || "Unknown recipe"}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              ))}

              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments found.</p>
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
