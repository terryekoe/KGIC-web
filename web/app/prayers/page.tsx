"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrayerCard } from "@/components/ui/prayer-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface DbPrayer {
  id: string;
  title: string;
  content: string;
  author: string | null;
  excerpt: string | null;
  is_featured: boolean;
  status: string;
  scheduled_for: string | null; // date string
  created_at: string;
}

export default function PrayersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todays, setTodays] = useState<DbPrayer | null>(null);
  const [recent, setRecent] = useState<DbPrayer[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase is not configured");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Use plain YYYY-MM-DD for DATE type comparison
      const now = new Date();
      const todayStr = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD

      // 1) Try fetch featured for today: is_featured true OR scheduled_for <= today
      const { data: featuredData, error: featuredErr } = await supabase
        .from("prayers")
        .select(
          "id,title,content,author,excerpt,is_featured,status,scheduled_for,created_at"
        )
        .eq("status", "published")
        .or(`is_featured.eq.true,scheduled_for.lte.${todayStr}`)
        .order("is_featured", { ascending: false })
        .order("scheduled_for", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1);

      if (featuredErr) {
        console.warn("Failed to fetch today's prayer:", featuredErr.message);
      }

      setTodays((featuredData && featuredData[0]) || null);

      // 2) Recent prayers (excluding the one already selected if any)
      const { data: recentData, error: recentErr } = await supabase
        .from("prayers")
        .select("id,title,excerpt,author,scheduled_for,created_at,status")
        .eq("status", "published")
        .order("scheduled_for", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentErr) {
        setError(recentErr.message);
      }

      let list = (recentData as DbPrayer[]) || [];
      if (featuredData && featuredData[0]) {
        list = list.filter((p) => p.id !== featuredData[0].id);
      }
      setRecent(list);
      setLoading(false);
    }

    load();
  }, []);

  const formatDate = (p: DbPrayer) => {
    const d = p.scheduled_for || p.created_at;
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Morning Prayer</h1>
          <p className="text-muted-foreground text-lg">
            Start your day with prayer and reflection
          </p>
        </div>

        {/* Today's Prayer */}
        <section className="mb-12">
          {loading ? (
            <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground">
              Loading…
            </div>
          ) : todays ? (
            <PrayerCard
              id={todays.id}
              title={todays.title}
              date={formatDate(todays)}
              author={todays.author || undefined}
              content={todays.content}
              variant="full"
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground">
              {error ? `Could not load today\'s prayer: ${error}` : "No published prayer yet."}
            </div>
          )}
        </section>

        {/* Recent Prayers */}
        <section>
          <h3 className="text-xl font-bold mb-6">Recent Prayers</h3>
          <div className="space-y-4">
            {recent.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                id={prayer.id}
                title={prayer.title}
                date={formatDate(prayer)}
                excerpt={prayer.excerpt || undefined}
                variant="preview"
              />
            ))}
            {!loading && recent.length === 0 && (
              <div className="text-sm text-muted-foreground">No other prayers found.</div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}