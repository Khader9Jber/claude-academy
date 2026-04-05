"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-muted">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Derive URL error without an effect
  const urlError = useMemo(() => {
    const param = searchParams.get("error");
    return param === "auth_failed" ? "Authentication failed. Please try again." : null;
  }, [searchParams]);

  const error = formError ?? urlError;

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/progress");
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setFormError(signInError.message);
      setSubmitting(false);
    } else {
      router.push("/progress");
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setFormError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setFormError(oauthError.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        data-testid="auth-login-form"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <LogIn className="h-6 w-6" />
          </div>
          <h1
            data-testid="auth-login-heading"
            className="font-serif italic text-2xl text-foreground mb-2"
          >
            Welcome back
          </h1>
          <p className="text-sm text-muted">
            Sign in to sync your progress and earn certificates
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            data-testid="auth-login-error"
            className="mb-6 flex items-center gap-2 rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* OAuth buttons — coming soon */}
        <div className="space-y-3 mb-6">
          <button
            data-testid="auth-login-google"
            disabled
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3",
              "border border-border bg-surface-2 text-muted text-sm font-medium",
              "opacity-50 cursor-not-allowed"
            )}
            title="Google sign-in coming soon"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google (coming soon)
          </button>
          <button
            data-testid="auth-login-github"
            disabled
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3",
              "border border-border bg-surface-2 text-muted text-sm font-medium",
              "opacity-50 cursor-not-allowed"
            )}
            title="GitHub sign-in coming soon"
          >
            <svg className="h-5 w-5 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub (coming soon)
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-muted">or continue with email</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="email"
                data-testid="auth-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={cn(
                  "w-full rounded-lg border border-border bg-surface-2 pl-10 pr-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted/60",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                  "transition-colors"
                )}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="password"
                data-testid="auth-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className={cn(
                  "w-full rounded-lg border border-border bg-surface-2 pl-10 pr-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted/60",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                  "transition-colors"
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            data-testid="auth-login-submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            data-testid="auth-login-signup-link"
            className="text-accent hover:text-foreground transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
