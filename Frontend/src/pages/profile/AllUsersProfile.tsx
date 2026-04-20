import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Bookmark,
  MessageSquare,
  Heart,
  Award,
  Loader2,
  RefreshCw,
  ChefHat,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ProfileUser } from "../../data/UserProfileModel";
import {
  followUser,
  getPublicUserProfile,
  unfollowUser,
} from "../../services/userService";
import { RecipeCard } from "../../components/RecipeCard";
import { ProfileListDialog } from "./ui/ProfileListDialog";

const formatJoinDate = (value?: string | null) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function AllUsersProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const loadProfile = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getPublicUserProfile(id);
      const profile: ProfileUser = res.data?.data?.user;
      setUser(profile);
    } catch (error) {
      toast.error("Failed to load user profile");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const profileTags = useMemo(() => {
    const prefs = user?.preferences?.dietary_preferences || [];
    const skillLevel = user?.preferences?.skill_level;
    return skillLevel ? [skillLevel, ...prefs] : prefs;
  }, [user]);

  const followersList = user?.followers_list || [];
  const followingList = user?.following_list || [];
  const bookmarkedRecipes = user?.bookmarked_recipes || [];
  const cookedRecipes = user?.cooked_recipes || [];
  const createdRecipes = user?.created_recipes || [];
  const recentActivity = user?.recent_activity || [];
  const isChef = user?.role === "chef";
  const canFollow = user?.relationship?.can_follow;
  const isFollowing = user?.relationship?.is_following;

  const handleFollowToggle = async () => {
    if (!id || !canFollow) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowUser(id);
        toast.success(`Unfollowed ${user?.name || "user"}`);
      } else {
        await followUser(id);
        toast.success(`Following ${user?.name || "user"}`);
      }

      await loadProfile();
    } catch (error) {
      toast.error("Could not update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Profile unavailable</CardTitle>
            <CardDescription>
              We could not load this profile right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadProfile} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl mb-2">{user.name}&apos;s Profile</h1>
          <p className="text-muted-foreground">
            View profile details, cooking activity, and social stats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadProfile}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.profile_image || ""} alt={user.name} />
                  <AvatarFallback className="text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
                <Badge variant="secondary" className="mb-2 capitalize">
                  <User className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
                <Button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`transition-all ${
                    isFollowing
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {followLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </div>
              <div>
                <p className="font-medium">{user.bio || "No bio available"}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location || "No location added"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatJoinDate(user.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user.preferences?.skill_level || "Beginner"} Cook
                  </span>
                </div>
              </div>

              {isChef ? (
                <>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <ChefHat className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.created_recipes || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Recipes</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFollowingOpen(true)}
                      className="text-center rounded-lg transition-colors hover:bg-muted/50 py-2"
                    >
                      <ChefHat className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.following || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFollowersOpen(true)}
                      className="text-center rounded-lg transition-colors hover:bg-muted/50 py-2"
                    >
                      <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.followers || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Bookmark className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.bookmarks || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Saved</p>
                    </div>

                    <div className="text-center">
                      <MessageSquare className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.comments || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>

                    <div className="text-center">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.cooked_recipes || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Cooked</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setFollowersOpen(true)}
                      className="text-center rounded-lg transition-colors hover:bg-muted/50 py-2"
                    >
                      <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.followers || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFollowingOpen(true)}
                      className="text-center rounded-lg transition-colors hover:bg-muted/50 py-2"
                    >
                      <ChefHat className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">
                        {user.stats?.following || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </button>
                  </div>
                </>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Profile Tags</p>
                <div className="flex flex-wrap gap-2">
                  {profileTags.length > 0 ? (
                    profileTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No profile tags
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="created" className="w-full">
            <TabsList
              className={`grid w-full ${isChef ? "grid-cols-3" : "grid-cols-3"}`}
            >
              <TabsTrigger value="bookmarks">Bookmarked</TabsTrigger>

              {isChef ? (
                <TabsTrigger value="created">Recipes</TabsTrigger>
              ) : (
                <TabsTrigger value="cooked">Cooked</TabsTrigger>
              )}
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Bookmarked Recipes</CardTitle>
                  <CardDescription>
                    Saved recipes by {user.name} ({user.stats?.bookmarks || 0}{" "}
                    total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookmarkedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bookmarkedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      No bookmarked recipes.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cooked">
              <Card>
                <CardHeader>
                  <CardTitle>Cooked Recipes</CardTitle>
                  <CardDescription>
                    Recipes cooked by {user.name} (
                    {user.stats?.cooked_recipes || 0} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cookedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cookedRecipes.map((recipe) => (
                        <RecipeCard
                          key={`${recipe.id}-cooked`}
                          recipe={recipe}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      No cooked recipes yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isChef ? (
              <TabsContent value="created">
                <Card>
                  <CardHeader>
                    <CardTitle>Created Recipes</CardTitle>
                    <CardDescription>
                      Recipes created by {user.name} (
                      {user.stats?.created_recipes || 0} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {createdRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {createdRecipes.map((recipe) => (
                          <RecipeCard
                            key={`${recipe.id}-created`}
                            recipe={recipe}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        No created recipes yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ) : null}

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest public activity from this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="border-l-2 border-primary pl-4 py-2"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {item.type === "comment" && (
                              <MessageSquare className="h-4 w-4 text-primary" />
                            )}
                            {item.type === "bookmark" && (
                              <Bookmark className="h-4 w-4 text-primary" />
                            )}
                            {item.type === "cooked" && (
                              <Heart className="h-4 w-4 text-primary" />
                            )}
                            {item.type === "follower" && (
                              <User className="h-4 w-4 text-primary" />
                            )}
                            <span className="font-semibold text-sm">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {item.text ? (
                            <p className="text-sm text-muted-foreground">
                              “{item.text}”
                            </p>
                          ) : null}
                          {typeof item.rating === "number" ? (
                            <p className="text-xs text-muted-foreground mt-1">
                              Rating: {item.rating}/5
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      No recent activity found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ProfileListDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        title="Followers"
        description={`People who follow ${user.name}`}
        profiles={followersList}
      />

      <ProfileListDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        title="Following"
        description={`People followed by ${user.name}`}
        profiles={followingList}
      />
    </>
  );
}
