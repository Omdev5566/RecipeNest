import { AdminSidebar } from '../../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ChefHat, FolderOpen, Users, TrendingUp } from 'lucide-react';
import { recipes, categories } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
  // Analytics data
  const stats = [
    {
      title: 'Total Recipes',
      value: recipes.length,
      icon: ChefHat,
      change: '+12% from last month',
      trend: 'up'
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderOpen,
      change: '+2 new categories',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '2,847',
      icon: Users,
      change: '+18% from last week',
      trend: 'up'
    },
    {
      title: 'Recipe Views',
      value: '45,231',
      icon: TrendingUp,
      change: '+24% this week',
      trend: 'up'
    }
  ];

  // Category distribution data
  const categoryData = categories.map(cat => ({
    name: cat.name,
    recipes: cat.recipeCount
  }));

  // Weekly views data
  const weeklyData = [
    { day: 'Mon', views: 4200 },
    { day: 'Tue', views: 5100 },
    { day: 'Wed', views: 4800 },
    { day: 'Thu', views: 6200 },
    { day: 'Fri', views: 7100 },
    { day: 'Sat', views: 8500 },
    { day: 'Sun', views: 9200 }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to ChefPortal - Your comprehensive recipe management hub for culinary professionals</p>
        </div>

        {/* Stats Grid */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipes by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="recipes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Recipe Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
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

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipes.slice(0, 5).map(recipe => (
                <div key={recipe.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{recipe.title}</p>
                      <p className="text-sm text-muted-foreground">By {recipe.chef}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {recipe.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}