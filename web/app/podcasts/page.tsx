"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { PodcastCard } from "@/components/ui/podcast-card";
import { Header } from "@/components/layout/header";
// Removed Footer import since footer should not appear on podcasts page
// import { Footer } from "@/components/layout/footer";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useI18n } from "@/components/ui/i18n-provider";
import Image from "next/image";

export default function PodcastsPage() {
  const { t } = useI18n();
  const supabase = getSupabaseClient();

  const [loading, setLoading] = React.useState(true);
  const [episodes, setEpisodes] = React.useState<Array<{
    id: string | number;
    title: string;
    artist: string | null;
    audio_url: string;
    duration_seconds: number | null;
    published_at: string | null;
    description: string | null;
    image_url: string | null;
    play_count?: number | null;
  }>>([]);

  // Search & Filters state
  const [query, setQuery] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");
  const [duration, setDuration] = React.useState<"all" | "short" | "medium" | "long">("all");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = React.useState(false);

  // Mobile/Tablet filter drawer state
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Curated Christian theme categories with keywords for matching
  const CATEGORY_DEFS = React.useMemo(
    () => [
      { id: "anointing", keywords: ["anoint", "anointing"] },
      { id: "grace", keywords: ["grace"] },
      { id: "healing", keywords: ["healing", "heal"] },
      { id: "favour", keywords: ["favour", "favor"] },
      { id: "thanksgiving", keywords: ["thanksgiving", "thanks", "gratitude"] },
      { id: "deliverance", keywords: ["deliverance", "deliver"] },
      { id: "faith", keywords: ["faith", "believe", "belief"] },
      { id: "salvation", keywords: ["salvation", "save", "saved"] },
      { id: "prayer", keywords: ["prayer", "pray"] },
      { id: "worship", keywords: ["worship", "praise"] },
      { id: "love", keywords: ["love", "agape"] },
      { id: "hope", keywords: ["hope"] },
      { id: "joy", keywords: ["joy", "rejoice"] },
      { id: "prosperity", keywords: ["prosperity", "prosper", "wealth"] },
      { id: "purpose", keywords: ["purpose", "calling", "destiny"] },
      { id: "holySpirit", keywords: ["holy spirit", "holyghost", "holy ghost", "spirit"] },
      { id: "wisdom", keywords: ["wisdom"] },
      { id: "transformation", keywords: ["transform", "transformation", "renewal", "renew"] },
      { id: "breakthrough", keywords: ["breakthrough", "break through"] },
      { id: "revival", keywords: ["revival", "revive"] },
    ],
    []
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setDuration("all");
    setSelectedCategories([]);
  };

  const filteredEpisodes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const hasQ = q.length > 0;
    const df = dateFrom ? new Date(dateFrom) : null;
    const dt = dateTo ? new Date(dateTo) : null;

    // Build keyword list for selected categories
    const selectedKeywordSet = new Set<string>();
    if (selectedCategories.length > 0) {
      CATEGORY_DEFS.filter((def) => selectedCategories.includes(def.id)).forEach(
        (def) => def.keywords.forEach((k) => selectedKeywordSet.add(k.toLowerCase()))
      );
    }

    return episodes.filter((ep) => {
      // Search in title or artist
      const title = (ep.title || "").toLowerCase();
      const artist = (ep.artist || "").toLowerCase();
      const haystack = `${title} ${artist}`;
      if (hasQ && !(title.includes(q) || artist.includes(q))) return false;

      // Date range fit
      if (df || dt) {
        const d = ep.published_at ? new Date(ep.published_at) : null;
        if (!d) return false;
        if (df && d < df) return false;
        if (dt) {
          const end = new Date(dt);
          end.setHours(23, 59, 59, 999);
          if (d > end) return false;
        }
      }

      // Duration filter
      const secs = ep.duration_seconds || 0;
      if (duration === "short" && !(secs > 0 && secs < 15 * 60)) return false;
      if (duration === "medium" && !(secs >= 15 * 60 && secs <= 40 * 60)) return false;
      if (duration === "long" && !(secs > 40 * 60)) return false;

      // Category filter by curated keywords
      if (selectedKeywordSet.size > 0) {
        let ok = false;
        for (const kw of selectedKeywordSet) {
          if (haystack.includes(kw)) {
            ok = true;
            break;
          }
        }
        if (!ok) return false;
      }
      return true;
    });
  }, [episodes, query, dateFrom, dateTo, duration, selectedCategories, CATEGORY_DEFS]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("podcasts")
        .select(
          // Removed play_count to avoid errors on environments where the column hasn't been added yet
          "id,title,artist,audio_url,duration_seconds,published_at,status,description,image_url"
        )
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
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (s: number | null) => {
    if (!s || s <= 0) return "";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Reusable filter content
  const filterContent = (
    <>
      <h3 className="font-semibold mb-3">{t("podcastsPage.filters.title")}</h3>

      {/* Categories (checkboxes - desktop only) */}
      <div className="mb-5 hidden lg:block">
        <div className="text-sm font-medium mb-2">
          {t("podcastsPage.filters.categories.title")}
        </div>
        <div className="flex flex-col gap-2">
          {(showAllCategories ? CATEGORY_DEFS : CATEGORY_DEFS.slice(0, 8)).map(
            (cat) => (
              <label key={cat.id} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                <span>
                  {t(
                    `podcastsPage.filters.categories.items.${cat.id}` as any
                  )}
                </span>
              </label>
            )
          )}
          {CATEGORY_DEFS.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              {showAllCategories
                ? t("podcastsPage.filters.categories.showLess")
                : t("podcastsPage.filters.categories.showMore")}
            </button>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-5">
        <div className="text-sm font-medium mb-2">{t("podcastsPage.filters.date")}</div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="mb-5">
        <div className="text-sm font-medium mb-2">{t("podcastsPage.filters.duration")}</div>
        <div className="flex flex-wrap gap-2">
          {(["all", "short", "medium", "long"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setDuration(opt)}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                duration === opt
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {opt === "all"
                ? t("podcastsPage.filters.durationAll")
                : t(`podcastsPage.filters.${opt}` as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {t("podcastsPage.filters.clear")}
        </button>
        <button
          type="button"
          onClick={() => setIsFilterOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground lg:hidden"
        >
          {/* Use a plain label to avoid missing translation key */}
          Close
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner */}
      <div className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden">
        <Image src="/microphone.jpg" alt="Microphone" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-blue-600/80" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
          <div className="text-white z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Podcasts
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Experience God's word in a fresh way through inspiring messages and
              biblical teachings
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("podcastsPage.backToHome")}
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            {t("podcastsPage.loading")}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - desktop only */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="rounded-xl border border-border p-4 bg-card lg:sticky lg:top-24">
                {filterContent}
              </div>
            </aside>

            {/* Results */}
            <section className="lg:col-span-3 space-y-6">
              {/* Search Bar with Filter Button (mobile/tablet) */}
              <div className="flex items-center gap-2">
                <label htmlFor="podcast-search" className="sr-only">
                  {t("podcastsPage.searchAriaLabel")}
                </label>
                <input
                  id="podcast-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("podcastsPage.searchPlaceholder")}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted lg:hidden"
                  aria-label="Open Filters"
                >
                  <Filter className="w-4 h-4" />
                  {t("podcastsPage.filters.title")}
                </button>
              </div>

              <div className="space-y-4">
                {episodes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("podcastsPage.noEpisodes")}
                  </p>
                ) : filteredEpisodes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("podcastsPage.filters.noResults")}
                  </p>
                ) : (
                  filteredEpisodes.map((ep) => (
                    <PodcastCard
                      key={ep.id}
                      id={ep.id as any}
                      title={ep.title}
                      date={formatDate(ep.published_at) || ""}
                      duration={formatDuration(ep.duration_seconds)}
                      audioUrl={ep.audio_url}
                      artist={ep.artist || t("podcasts.artistDefault")}
                      description={ep.description || undefined}
                      imageUrl={ep.image_url || undefined}
                      playCount={ep.play_count ?? 0}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Mobile/Tablet Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 font-semibold">
                <Filter className="w-4 h-4" /> {t("podcastsPage.filters.title")}
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Footer intentionally removed on this page */}
    </div>
  );
}