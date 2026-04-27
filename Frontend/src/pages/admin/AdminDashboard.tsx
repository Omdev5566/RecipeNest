import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, ChefHat, ShieldCheck, BookOpen, MessageSquare, Loader2 } from "lucide-react";
import { getAdminDashboard } from "../../services/adminService";

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				setLoading(true);
				const response = await getAdminDashboard();
				setData(response);
			} finally {
				setLoading(false);
			}
		};

		loadDashboard();
	}, []);

	const stats = [
		{
			title: "Total Users",
			value: data?.stats?.total_users ?? 0,
			icon: Users,
		},
		{
			title: "Total Chefs",
			value: data?.stats?.total_chefs ?? 0,
			icon: ChefHat,
		},
		{
			title: "Total Admins",
			value: data?.stats?.total_admins ?? 0,
			icon: ShieldCheck,
		},
		{
			title: "Total Recipes",
			value: data?.stats?.total_recipes ?? 0,
			icon: BookOpen,
		},
		{
			title: "Total Comments",
			value: data?.stats?.total_comments ?? 0,
			icon: MessageSquare,
		},
	];

	if (loading) {
		return (
			<div className="p-8 flex items-center justify-center min-h-screen">
				<div className="flex items-center gap-3 text-muted-foreground">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading admin dashboard...
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-4xl mb-2">Admin Dashboard</h1>
				<p className="text-muted-foreground">Overview of platform activity and moderation</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.title}>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
								<Icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{stat.value}</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{(data?.recent_users || []).map((user: any) => (
							<div key={user.id} className="border-b pb-2 last:border-0">
								<p className="font-medium">{user.name}</p>
								<p className="text-sm text-muted-foreground">{user.email} • {user.role}</p>
							</div>
						))}
						{(data?.recent_users || []).length === 0 ? (
							<p className="text-sm text-muted-foreground">No users found.</p>
						) : null}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Recipes</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{(data?.recent_recipes || []).map((recipe: any) => (
							<div key={recipe.id} className="border-b pb-2 last:border-0">
								<p className="font-medium">{recipe.title}</p>
								<p className="text-sm text-muted-foreground">{recipe.chef_name || "Unknown chef"}</p>
							</div>
						))}
						{(data?.recent_recipes || []).length === 0 ? (
							<p className="text-sm text-muted-foreground">No recipes found.</p>
						) : null}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Categories</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{(data?.top_categories || []).map((category: any) => (
							<div key={category.category} className="flex items-center justify-between border-b pb-2 last:border-0">
								<p className="font-medium">{category.category || "Uncategorized"}</p>
								<p className="text-sm text-muted-foreground">{category.total}</p>
							</div>
						))}
						{(data?.top_categories || []).length === 0 ? (
							<p className="text-sm text-muted-foreground">No categories found.</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

