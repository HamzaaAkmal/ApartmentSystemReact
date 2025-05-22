"use client"; // Add this directive

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react"; // Import useState
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth function
import { auth } from "../../../lib/firebase"; // Import auth object (adjust path if needed)

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter(); // Not strictly needed here as AuthContext handles redirection

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is handled by AuthContext
      // router.push('/admin/dashboard'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center text-sm text-green-700 hover:underline md:left-8 md:top-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image
              src="/placeholder.svg?height=50&width=50" // Consider using a real logo
              alt="Logo"
              width={50}
              height={50}
              className="rounded-md bg-green-700 p-2"
            />
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500">Enter your credentials to access the admin dashboard</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="admin@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/admin/forgot-password" className="text-sm text-green-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
              )}
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
