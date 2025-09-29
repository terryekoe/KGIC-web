import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';

// Server route to handle podcast audio uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server is not configured for uploads" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Ensure bucket exists (idempotent)
    await supabase.storage.createBucket("podcasts", { public: true }).catch(() => {});

    const ext = (file.name?.split(".").pop() || "mp3").toLowerCase();
    const datePrefix = new Date().toISOString().slice(0, 10);
    const uid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    const path = `public/audios/${datePrefix}/${uid}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage.from("podcasts").upload(path, new Uint8Array(arrayBuffer), {
      contentType: file.type || "audio/mpeg",
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: pub } = supabase.storage.from("podcasts").getPublicUrl(path);
    return NextResponse.json({ path, publicUrl: pub?.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}