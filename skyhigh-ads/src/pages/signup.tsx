import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = { name, email, password, role };
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Prevent duplicate registration
    if (existingUsers.some((u: any) => u.email === email)) {
      toast.error("Email already registered!");
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    toast.success("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 pt-20">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email"
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
            <div>
              <Label>Register as</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
              >
                <option value="client">Client</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
