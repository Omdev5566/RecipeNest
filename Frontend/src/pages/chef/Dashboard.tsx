import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ChefHat, FolderOpen, Users, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getAllRecipesForAnalytics, getChefProfile } from '../../services/chefServices';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, recipesData] = await Promise.all([
          getChefProfile(),
          getAllRecipesForAnalytics(),
        ]);

        setProfile(profileData);
        setAllRecipes(recipesData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const myRecipes = useMemo(() => profile?.created_recipes || [], [profile]);

  const categoryData = useMemo(() => {
    const map = new Map();

    myRecipes.forEach((recipe: any) => {
      if (!recipe.category) return;
      map.set(recipe.category, (map.get(recipe.category) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, recipes]) => ({ name, recipes }));
  }, [myRecipes]);

  const weeklyData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const counts = labels.map((day) => ({ day, views: 0 }));

    myRecipes.forEach((recipe: any) => {
      const createdAt = new Date(recipe.created_at);
      if (Number.isNaN(createdAt.getTime()) || createdAt < start || createdAt > today) {
        return;
      }

      const dayIndex = createdAt.getDay();
      const normalized = dayIndex === 0 ? 6 : dayIndex - 1;
      counts[normalized].views += 1;
    });

    return counts;
  }, [myRecipes]);

  const stats = useMemo(() => [
    {
      title: 'My Recipes',
      value: myRecipes.length,
      icon: ChefHat,
      change: 'Published recipes',
    },
    {
      title: 'Categories',
      value: categoryData.length,
      icon: FolderOpen,
      change: 'Used in your recipes',
    },
    {
      title: 'Followers',
      value: profile?.stats?.followers || 0,
      icon: Users,
      change: 'People following you',
    },
    {
      title: 'Total Platform Recipes',
      value: allRecipes.length,
      icon: TrendingUp,
      change: 'Across all chefs',
    },
  ], [myRecipes.length, categoryData.length, profile?.stats?.followers, allRecipes.length]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Live insights from your chef account and recipes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Recipes by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="recipes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipes Added This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRecipes.slice(0, 5).map((recipe: any) => (
                <div key={recipe.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe.image || recipe.image_url}
                      alt={recipe.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{recipe.title}</p>
                      <p className="text-sm text-muted-foreground">By {recipe.chef_name}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}

              {myRecipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recipes created yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
