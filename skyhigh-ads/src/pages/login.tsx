import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Simulated login check (replace later with API)
    const userData = localStorage.getItem("users");
    if (!userData) {
      toast.error("No user found. Please register first!");
      return;
    }

    const users = JSON.parse(userData);
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      toast.error("Invalid credentials!");
      return;
    }

    // ✅ Store session
    localStorage.setItem("currentUser", JSON.stringify(user));

    toast.success(`Welcome ${user.role}! Redirecting...`);

    // Redirect based on role
    if (user.role === "owner") navigate("/dashboard/owner");
    else if (user.role === "client") navigate("/dashboard/client");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 pt-20">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
