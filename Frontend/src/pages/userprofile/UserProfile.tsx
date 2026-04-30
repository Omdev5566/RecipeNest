import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { ProfileUser } from "../../data/UserProfileModel";
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
  LogOut,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { RecipeCard } from "../../components/RecipeCard";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../../services/userService";
import { ProfileListDialog } from "./ui/profileListDialog";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

export default function FoodLoverProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const profile: ProfileUser = res.data?.data?.user;
      setUser(profile);
      setName(profile?.name || "");
      setPhone(profile?.phone || "");
      setLocation(profile?.location || "");
      setBio(profile?.bio || "");
      setAvatarPreview(profile?.profile_image || "");
    } catch (error) {
      toast.error("Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await updateProfile({ name, phone, location, bio });
      const updatedUser: ProfileUser = res.data?.data?.user;
      setUser(updatedUser);
      setName(updatedUser?.name || "");
      setPhone(updatedUser?.phone || "");
      setLocation(updatedUser?.location || "");
      setBio(updatedUser?.bio || "");
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const favoriteCategories = useMemo(() => {
    const prefs = user?.preferences?.dietary_preferences || [];
    const skillLevel = user?.preferences?.skill_level;
    return skillLevel ? [skillLevel, ...prefs] : prefs;
  }, [user]);

  const bookmarkedRecipes = user?.bookmarked_recipes || [];
  const recentActivity = user?.recent_activity || [];
  const followersList = user?.followers_list || [];
  const followingList = user?.following_list || [];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("Image must be 5MB or smaller");
      return false;
    }
    return true;
  };

  const handleAvatarUpload = async (file: File) => {
    if (!validateImage(file)) return;

    try {
      setUploadingAvatar(true);
      if (avatarPreview && avatarPreview.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(URL.createObjectURL(file));

      await uploadAvatar(file);
      await loadProfile();
      toast.success("Avatar updated");
    } catch (err) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleAvatarUpload(file);
    e.currentTarget.value = "";
  };

  const onDropAvatar = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleAvatarUpload(file);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your profile...
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
              We could not load your profile data right now.
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
          <h1 className="text-4xl mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your cooking profile and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadProfile}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
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
              <div
                className="flex flex-col items-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDropAvatar}
              >
                <div className="relative">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage
                      src={user.profile_image || avatarPreview || ""}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-3xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileInputChange}
                    className="hidden"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
                {user.role == "user" ? (
                  <Badge variant="secondary" className="mb-4">
                    <User className="h-3 w-3 mr-1" />
                    Food Lover
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="mb-4">
                    <User className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
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

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">
                  Favorite Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {favoriteCategories.length > 0 ? (
                    favoriteCategories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No preferences added yet
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
              <TabsTrigger value="activity">My Activity</TabsTrigger>
            </TabsList>

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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={user.email} disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about your cooking journey, favorite cuisines, and what you love to make..."
                      />
                    </div>

                    <div>
                      <Label>Dietary Preferences</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {user.preferences?.dietary_preferences?.length ? (
                          user.preferences.dietary_preferences.map((pref) => (
                            <Badge
                              key={pref}
                              variant="outline"
                              className="justify-center py-1"
                            >
                              {pref}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground col-span-full">
                            No dietary preferences selected
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" size="lg" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setName(user.name);
                          setPhone(user.phone || "");
                          setLocation(user.location || "");
                          setBio(user.bio || "");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Recipes</CardTitle>
                  <CardDescription>
                    Your collection of bookmarked recipes (
                    {user.stats?.bookmarks || 0} total)
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
                      No bookmarked recipes yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent reviews, bookmarks, cooked recipes, and
                    followers
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
        description="People who follow your profile"
        profiles={followersList}
      />

      <ProfileListDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        title="Following"
        description="People you follow"
        profiles={followingList}
      />
    </>
  );
}
