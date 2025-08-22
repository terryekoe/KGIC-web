"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { LogOut, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [signedOut, setSignedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setSignedOut(true); // Treat as signed out for UX
      return;
    }

    supabase.auth.signOut()
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          setSignedOut(true);
        }
      })
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-xl">Goodbye!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : signedOut ? (
              <>
                <p className="text-foreground font-medium">You have been signed out successfully.</p>
                <p className="text-sm text-muted-foreground">Thank you for serving — see you soon!</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Signing you out…</p>
            )}

            <div className="flex gap-2 justify-center pt-2">
              <Button onClick={() => router.push('/')} variant="outline">Go to Homepage</Button>
              <Button onClick={() => router.push('/auth/sign-in')} className="bg-accent hover:bg-accent/90">Sign in again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}