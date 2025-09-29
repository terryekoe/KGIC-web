import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';

// Increment play_count for a given podcast id.
export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Atomic increment via SECURITY DEFINER RPC created by migration
    const { error } = await admin.rpc("increment_podcast_play_count", { p_id: id });
    if (error) {
      const missing = /function .*increment_podcast_play_count/i.test(error.message || "");
      if (missing) {
        return NextResponse.json({ error: "RPC increment_podcast_play_count not found. Run migrations.", code: "RPC_MISSING" }, { status: 501 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to increment" }, { status: 500 });
  }
}