"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/admin";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Check if user is already signed in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Ensure server cookies are up-to-date so middleware allows access
        await fetch("/api/auth/refresh", { method: "POST" });
        router.push(nextPath);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Sync cookies on the server before redirecting
        await fetch("/api/auth/refresh", { method: "POST" });
        router.push(nextPath);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Authentication is not configured. Please set Supabase environment variables.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Success: sync cookies then redirect
    await fetch("/api/auth/refresh", { method: "POST" });
    router.push(nextPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="max-w-md mx-auto px-6 py-16 space-y-6">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="KGIC logo" width={72} height={72} className="rounded-sm" />
        </div>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">Admin Sign In</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard.</p>
            </div>

            {error && (
              <div className="text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-muted-foreground">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-accent hover:bg-accent/90"
                size="lg"
              >
                <LogIn size={20} />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Only authorized church administrators can access this area.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Homepage */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')} 
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}