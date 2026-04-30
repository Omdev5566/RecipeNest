import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChefHat } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);
      const user = res.data.data; // ✅ make sure backend returns this

      setUser(user); // update global state
      toast.success("Login successful");

      // ✅ redirect based on backend role
      if (user.role === "chef") {
        navigate("/chef");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <ChefHat className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-4xl font-bold">RecipeNest</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>

              <Button className="w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/")}>
                Continue as Guest
              </Button>
            </div>

          </CardContent>
        </Card>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Button variant="link" onClick={() => navigate("/register")}>
            Sign up
          </Button>
        </p>

      </div>
    </div>
  );
}