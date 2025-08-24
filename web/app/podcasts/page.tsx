"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PodcastCard } from "@/components/ui/podcast-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import React from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function PodcastsPage() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = React.useState(true);
  const [episodes, setEpisodes] = React.useState<Array<{ id: number; title: string; artist: string | null; audio_url: string; duration_seconds: number | null; published_at: string | null }>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("podcasts")
        .select("id,title,artist,audio_url,duration_seconds,published_at,status")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (!error && data) setEpisodes(data as any);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDuration = (s: number | null) => {
    if (!s || s <= 0) return "";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Podcasts</h1>
          <p className="text-muted-foreground text-lg">Stream messages and download to listen offline</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading podcasts…</p>
        ) : episodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published podcasts yet.</p>
        ) : (
          <section className="space-y-4">
            {episodes.map((ep) => (
              <PodcastCard
                key={ep.id}
                id={ep.id}
                title={ep.title}
                date={formatDate(ep.published_at) || ""}
                duration={formatDuration(ep.duration_seconds)}
                audioUrl={ep.audio_url}
                artist={ep.artist || "KGIC"}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}