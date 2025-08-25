'use client';

import { useState } from "react";
import { createClient } from "@v1/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Alert, AlertDescription } from "@v1/ui/alert";
import { Loader2, Shield, User, Lock } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("dev@example.com");
  const [password, setPassword] = useState("devpassword123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setSuccess("Login successful! Redirecting to dashboard...");
        
        // Check if user has developer access
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, developer_mode')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        }

        const hasDeveloperAccess = (userData as any)?.role === 'DEVELOPER' || (userData as any)?.developer_mode;

        if (hasDeveloperAccess) {
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          setError("Access denied. Developer account required.");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "dev@example.com",
        password: "devpassword123",
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setSuccess("Quick login successful! Redirecting to dashboard...");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setError("Quick login failed. Please try manual login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Developer Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the development dashboard with your developer credentials
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Enter your developer credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="dev@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleQuickLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Quick Login (Dev)'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Developer Credentials</CardTitle>
            <CardDescription>
              Use these credentials for development access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                <User className="h-4 w-4" />
                Email
              </div>
              <p className="text-blue-700 font-mono text-sm mt-1">dev@example.com</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                <Lock className="h-4 w-4" />
                Password
              </div>
              <p className="text-green-700 font-mono text-sm mt-1">devpassword123</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Check the console for detailed error messages.
          </p>
        </div>
      </div>
    </div>
  );
}
