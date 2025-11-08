import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (files.avatar) {
      formData.append("avatar", files.avatar);
    }
    if (files.coverImage) {
      formData.append("coverImage", files.coverImage);
    }

    try {
      await api.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={form.fullname}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="avatar">Avatar (Optional)</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                onChange={onFileChange}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image (Optional)</Label>
              <Input
                id="coverImage"
                name="coverImage"
                type="file"
                onChange={onFileChange}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}