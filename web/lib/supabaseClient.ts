import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const HAS_SUPABASE_ENV = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (HAS_SUPABASE_ENV) {
    // Use Next.js auth helpers client to ensure cookie syncing with middleware
    client = createClientComponentClient();
    return client;
  }
  return null;
}