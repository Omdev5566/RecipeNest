import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminUser, getAdminUsers, updateAdminUserRole } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers({ page, limit: 10, search, role });
      setUsers(data?.users || []);
      setPagination(data?.pagination || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    loadUsers();
  };

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      await updateAdminUserRole(userId, newRole);
      toast.success("User role updated");
      loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteAdminUser(userId);
      toast.success("User deleted");
      loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Manage Users</h1>
        <p className="text-muted-foreground">Search, update roles, and remove accounts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="chef">Chef</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={applyFilters}>Apply</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 flex justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="border rounded-md p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-9 rounded-md border bg-background px-3 text-sm"
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      disabled={Number(currentUser?.id) === Number(user.id)}
                    >
                      <option value="user">User</option>
                      <option value="chef">Chef</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={Number(currentUser?.id) === Number(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
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
