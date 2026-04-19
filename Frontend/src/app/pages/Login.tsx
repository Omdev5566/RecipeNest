import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ChefHat, User, Shield } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chef");

  const handleLogin = (e: React.FormEvent, role: string) => {
    e.preventDefault();
    toast.success(`Logged in as ${role}`);

    if (role === "Chef" || role === "Administrator") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <ChefHat className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">RecipeNest</h1>
          </div>
          <p className="text-muted-foreground">
            Discover and Share Culinary Excellence
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chef">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Chef
                </TabsTrigger>
                <TabsTrigger value="foodlover">
                  <User className="h-4 w-4 mr-2" />
                  Food Lover
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chef">
                <form
                  onSubmit={(e) => handleLogin(e, "Chef")}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="chef-email">Email</Label>
                    <Input
                      id="chef-email"
                      type="email"
                      placeholder="chef@recipenest.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="chef-password">Password</Label>
                    <Input
                      id="chef-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in as Chef
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Access ChefPortal to manage your recipes
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="foodlover">
                <form
                  onSubmit={(e) => handleLogin(e, "Food Lover")}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="foodlover@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in as Food Lover
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Browse, bookmark, and discover recipes
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form
                  onSubmit={(e) => handleLogin(e, "Administrator")}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@recipenest.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in as Administrator
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Manage categories and moderate content
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="text-sm"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
}
