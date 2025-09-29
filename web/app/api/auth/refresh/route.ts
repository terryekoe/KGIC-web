import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Force Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';

// This endpoint refreshes the Supabase session cookies on the server.
// Call it on auth state changes (e.g., after sign-in) so middleware can see the session.
export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  // Calling getSession will set/refresh the cookies on the response if needed
  await supabase.auth.getSession();
  return NextResponse.json({ ok: true });
}