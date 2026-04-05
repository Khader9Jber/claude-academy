"use client";

import { useAuth } from "@/components/auth/auth-provider";

/**
 * Client-side hook that checks if the current user has the admin role.
 * The role lives in app_metadata which is set server-side and cannot be
 * tampered with via the client SDK.
 */
export function useAdmin() {
  const { user, loading } = useAuth();
  const isAdmin = user?.app_metadata?.role === "admin";
  return { isAdmin, loading, user };
}
