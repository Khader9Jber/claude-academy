"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/use-admin";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/?error=unauthorized");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div
        data-testid="admin-guard"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            data-testid="admin-guard-spinner"
            className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent"
          />
          <p className="text-sm text-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-testid="admin-guard"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            data-testid="admin-guard-spinner"
            className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent"
          />
          <p className="text-sm text-muted">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-guard">
      {children}
    </div>
  );
}
