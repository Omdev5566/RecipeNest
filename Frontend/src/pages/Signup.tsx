import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../components/ui/tabs";
import { ChefHat, User } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "../services/authService";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chef");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  // ✅ FIXED: proper typing + name-based update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ FIXED: correct event type
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    role: string
  ) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        role: role.toLowerCase(),
      };

      const res = await registerUser(payload);

      toast.success("Account created successfully");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (role === "Chef" || role === "Administrator") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <ChefHat className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-4xl font-bold">RecipeNest</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to get started
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

              {/* CHEF */}
              <TabsContent value="chef">
                <form onSubmit={(e) => handleRegister(e, "Chef")} className="space-y-4">
                  
                  <div>
                    <Label>Full Name</Label>
                    <Input name="name" onChange={handleChange} required />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" onChange={handleChange} required />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input name="password" type="password" onChange={handleChange} required />
                  </div>

                  <Button className="w-full">Register as Chef</Button>
                </form>
              </TabsContent>

              {/* FOOD LOVER */}
              <TabsContent value="foodlover">
                <form onSubmit={(e) => handleRegister(e, "Food Lover")} className="space-y-4">

                  <div>
                    <Label>Full Name</Label>
                    <Input name="name" onChange={handleChange} required />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" onChange={handleChange} required />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input name="password" type="password" onChange={handleChange} required />
                  </div>

                  <Button className="w-full">Register as Food Lover</Button>
                </form>
              </TabsContent>

            </Tabs>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/login")}>
                Already have an account? Login
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}