import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ChefHat, User, Shield } from "lucide-react";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chef");

  const handleRegister = (e: React.FormEvent, role: string) => {
    e.preventDefault();
    toast.success(`Account created as ${role}`);

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
            Join and Share Culinary Excellence
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to get started with RecipeNest
            </CardDescription>
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

              {/* Chef Registration */}
              <TabsContent value="chef">
                <form onSubmit={(e) => handleRegister(e, "Chef")} className="space-y-4">
                  <div>
                    <Label htmlFor="chef-name">Full Name</Label>
                    <Input id="chef-name" placeholder="Chef Name" required />
                  </div>
                  <div>
                    <Label htmlFor="chef-email">Email</Label>
                    <Input id="chef-email" type="email" placeholder="chef@recipenest.com" required />
                  </div>
                  <div>
                    <Label htmlFor="chef-password">Password</Label>
                    <Input id="chef-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full">Register as Chef</Button>
                </form>
              </TabsContent>

              {/* Food Lover Registration */}
              <TabsContent value="foodlover">
                <form onSubmit={(e) => handleRegister(e, "Food Lover")} className="space-y-4">
                  <div>
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="Your Name" required />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="foodlover@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Password</Label>
                    <Input id="user-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full">Register as Food Lover</Button>
                </form>
              </TabsContent>

              {/* Admin Registration */}
              <TabsContent value="admin">
                <form onSubmit={(e) => handleRegister(e, "Administrator")} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-name">Admin Name</Label>
                    <Input id="admin-name" placeholder="Admin Name" required />
                  </div>
                  <div>
                    <Label htmlFor="admin-email">Email</Label>
                    <Input id="admin-email" type="email" placeholder="admin@recipenest.com" required />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Password</Label>
                    <Input id="admin-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full">Register as Admin</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/login")} className="text-sm">
                Already have an account? Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
