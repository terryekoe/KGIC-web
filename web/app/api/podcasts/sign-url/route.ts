import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';

// POST { url?: string, path?: string }
// Returns { url: string } where url is a signed, time-limited URL for playback
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const inputUrl: string | undefined = body?.url;
    const inputPath: string | undefined = body?.path;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !serviceRoleKey) {
      // Fall back to original input; we cannot sign without service role
      const fallback = inputUrl || null;
      if (!fallback) return NextResponse.json({ error: "No URL or path provided" }, { status: 400 });
      return NextResponse.json({ url: fallback });
    }

    // Only allow signing for the 'podcasts' bucket
    const { bucket, path } = (() => {
      if (inputPath) {
        return { bucket: "podcasts", path: inputPath.replace(/^\/+/, "") };
      }
      if (!inputUrl) return { bucket: null as any, path: null as any };
      try {
        const u = new URL(inputUrl);
        // Expected formats:
        // - {SUPABASE_URL}/storage/v1/object/public/podcasts/<path>
        // - {SUPABASE_URL}/storage/v1/object/sign/podcasts/<path>?token=...
        const parts = u.pathname.split("/").filter(Boolean);
        const idx = parts.indexOf("podcasts");
        if (idx !== -1) {
          const objectPath = parts.slice(idx + 1).join("/");
          return { bucket: "podcasts", path: objectPath };
        }
        return { bucket: null as any, path: null as any };
      } catch {
        return { bucket: null as any, path: null as any };
      }
    })();

    if (bucket !== "podcasts" || !path) {
      return NextResponse.json({ error: "Unsupported URL or path" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // 12 hours expiry
    const expiresIn = 60 * 60 * 12;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || "Failed to sign URL" }, { status: 400 });
    }
    return NextResponse.json({ url: data.signedUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to sign URL" }, { status: 500 });
  }
}