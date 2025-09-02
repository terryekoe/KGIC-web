import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const HAS_SUPABASE_ENV = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (HAS_SUPABASE_ENV) {
    try {
      // Use Next.js auth helpers client to ensure cookie syncing with middleware
      client = createClientComponentClient();
      return client;
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      return null;
    }
  }
  return null;
}

// Helper function to safely execute Supabase auth operations with error handling
export async function safeSupabaseAuth<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase auth operation failed:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('Network connectivity issue with Supabase. This might be temporary.');
    }
    return fallback ?? null;
  }
}