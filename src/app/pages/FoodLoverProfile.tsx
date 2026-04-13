import { UserNavbar } from '../components/UserNavbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Mail, MapPin, Calendar, Bookmark, MessageSquare, Heart, Award } from 'lucide-react';
import { toast } from 'sonner';
import { RecipeCard } from '../components/RecipeCard';
import { recipes } from '../data/mockData';

export function FoodLoverProfile() {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  // Mock user data
  const userData = {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    location: 'San Francisco, CA',
    joinDate: 'February 2024',
    bio: 'Home cook passionate about trying new recipes and exploring different cuisines. Love experimenting with fusion dishes and baking on weekends!',
    favoriteCategories: ['Italian', 'Desserts', 'Quick Meals'],
    skillLevel: 'Intermediate',
    totalBookmarks: 24,
    totalComments: 18,
    recipesCooked: 47
  };

  // Mock bookmarked recipes (first 3 for display)
  const bookmarkedRecipes = recipes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your cooking profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-3xl">AT</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{userData.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    <User className="h-3 w-3 mr-1" />
                    Food Lover
                  </Badge>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.skillLevel} Cook</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Bookmark className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{userData.totalBookmarks}</p>
                    <p className="text-xs text-muted-foreground">Saved</p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{userData.totalComments}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{userData.recipesCooked}</p>
                    <p className="text-xs text-muted-foreground">Cooked</p>
                  </div>
                </div>

                {/* Favorite Categories */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Favorite Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.favoriteCategories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
                <TabsTrigger value="activity">My Activity</TabsTrigger>
              </TabsList>

              {/* Edit Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal details and cooking preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            defaultValue={userData.name}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email"
                            defaultValue={userData.email}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            defaultValue={userData.location}
                          />
                        </div>
                        <div>
                          <Label htmlFor="skillLevel">Cooking Skill Level</Label>
                          <select 
                            id="skillLevel" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue={userData.skillLevel}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea 
                          id="bio" 
                          rows={4}
                          defaultValue={userData.bio}
                          placeholder="Tell us about your cooking journey, favorite cuisines, and what you love to make..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Keto', 'Paleo', 'None'].map((pref) => (
                            <label key={pref} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="rounded" />
                              <span>{pref}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button type="submit" size="lg">
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" size="lg">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookmarks Tab */}
              <TabsContent value="bookmarks">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Recipes</CardTitle>
                    <CardDescription>
                      Your collection of bookmarked recipes ({userData.totalBookmarks} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bookmarkedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                      View All Bookmarks
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent reviews, comments, and interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Recent Comments */}
                      <div className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Reviewed "Spaghetti Carbonara"</span>
                          <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "This recipe is amazing! Made it for dinner last night..."
                        </p>
                      </div>

                      <div className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Bookmark className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Saved "Chocolate Lava Cake"</span>
                          <span className="text-xs text-muted-foreground ml-auto">5 days ago</span>
                        </div>
                      </div>

                      <div className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Cooked "Thai Green Curry"</span>
                          <span className="text-xs text-muted-foreground ml-auto">1 week ago</span>
                        </div>
                      </div>

                      <div className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Reviewed "Classic Tiramisu"</span>
                          <span className="text-xs text-muted-foreground ml-auto">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Perfect dessert for special occasions. Everyone loved it!"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
