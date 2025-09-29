import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Force Node.js runtime to avoid Edge Runtime issues with Supabase
export const runtime = 'nodejs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only protect admin; sign-in/out pages are always allowed
  const { pathname } = req.nextUrl;

  // If Supabase env isn't configured, redirect to sign-in without attempting a refresh
  const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!hasEnv) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Initialize Supabase client bound to this request/response
  const supabase = createMiddlewareClient({ req, res });

  try {
    // This will refresh the session if needed and sets cookies on the response
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/auth/sign-in";
      // Preserve where user was trying to go
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Authenticated – allow request to continue
    return res;
  } catch (_e) {
    // On any error, fail closed and redirect to sign-in
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    return NextResponse.redirect(redirectUrl);
  }
}

// Apply middleware only to /admin and its subpaths
export const config = {
  matcher: ["/admin/:path*"],
};