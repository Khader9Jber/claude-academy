import { createClient } from "@/lib/supabase/server";

/** Check whether the current user has the admin role (server-side). */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    return user.app_metadata?.role === "admin";
  } catch {
    return false;
  }
}

/** Throw if the current user is not an admin. Use in server actions / route handlers. */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
