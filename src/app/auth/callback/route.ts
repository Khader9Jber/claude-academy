import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Allow static export for GitHub Pages (auth won't work there, but build won't break)
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/progress";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
