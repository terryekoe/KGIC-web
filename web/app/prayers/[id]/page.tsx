"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PrayerCard } from "@/components/ui/prayer-card";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useI18n } from "@/components/ui/i18n-provider";

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

export default function PrayerDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const id = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayer, setPrayer] = useState<DbPrayer | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Missing prayer id");
        setLoading(false);
        return;
      }
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase is not configured");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("prayers")
        .select("id,title,content,author,excerpt,is_featured,status,scheduled_for,created_at")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setPrayer(null);
      } else {
        setPrayer(data as DbPrayer);
      }
      setLoading(false);
    }
    load();
  }, [id]);

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
          <Link href="/prayers" className="text-sm text-muted-foreground hover:text-foreground">
            {t("prayersPage.backToPrayers")}
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground">{t("prayersPage.loading")}</div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card p-8 text-destructive">{error}</div>
        ) : prayer ? (
          <PrayerCard
            id={prayer.id}
            title={prayer.title}
            date={formatDate(prayer)}
            author={prayer.author || undefined}
            content={prayer.content}
            variant="full"
          />
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground">{t("prayersPage.prayerNotFound")}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}