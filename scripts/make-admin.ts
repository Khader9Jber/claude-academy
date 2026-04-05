/**
 * Promote a user to admin by setting app_metadata.role = 'admin'.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/make-admin.ts <user-email>
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL  (from .env.local or environment)
 *   - SUPABASE_SERVICE_ROLE_KEY (pass via environment — NEVER commit this)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fatal(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

async function main() {
  const email = process.argv[2];

  if (!email) {
    fatal(
      "Usage: SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/make-admin.ts <user-email>"
    );
  }

  if (!SUPABASE_URL) {
    fatal("NEXT_PUBLIC_SUPABASE_URL is not set.");
  }

  if (!SERVICE_ROLE_KEY) {
    fatal(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Get it from the Supabase dashboard (Settings > API)."
    );
  }

  // Service-role client bypasses RLS
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find user by email
  const { data: userList, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    fatal(`Failed to list users: ${listError.message}`);
  }

  const user = userList.users.find((u) => u.email === email);
  if (!user) {
    fatal(`No user found with email: ${email}`);
  }

  // Update app_metadata to include the admin role
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { app_metadata: { ...user.app_metadata, role: "admin" } }
  );

  if (updateError) {
    fatal(`Failed to update user: ${updateError.message}`);
  }

  console.log(`Success: ${email} (${user.id}) is now an admin.`);
  console.log(
    "The user must sign out and back in for the change to take effect."
  );
}

main();
