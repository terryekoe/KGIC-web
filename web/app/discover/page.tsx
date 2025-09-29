"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Play, CalendarDays, Church, Users, Megaphone, Video } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useI18n } from "@/components/ui/i18n-provider";
import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay";

export default function DiscoverPage() {
  const supabase = getSupabaseClient();
  const { t } = useI18n();
  const [loading, setLoading] = React.useState({ prayer: true, podcast: true });
  const [latestPrayer, setLatestPrayer] = React.useState<null | { title: string; excerpt: string | null; date: string }>(null);
  const [latestPodcast, setLatestPodcast] = React.useState<null | { title: string; artist: string | null; date: string | null; duration: string; audioUrl: string }>(null);

  React.useEffect(() => {
    const fetchPrayer = async () => {
      if (!supabase) { setLoading((s) => ({ ...s, prayer: false })); return; }
      const { data, error } = await supabase
        .from("prayers")
        .select("title,excerpt,scheduled_for,created_at,status")
        .eq("status", "published")
        .order("scheduled_for", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1);
      if (!error && data && data[0]) {
        const d = (data[0] as any).scheduled_for ?? (data[0] as any).created_at;
        setLatestPrayer({
          title: (data[0] as any).title,
          excerpt: (data[0] as any).excerpt ?? null,
          date: new Date(d).toLocaleDateString(),
        });
      }
      setLoading((s) => ({ ...s, prayer: false }));
    };

    const fetchPodcast = async () => {
      if (!supabase) { setLoading((s) => ({ ...s, podcast: false })); return; }
      const { data, error } = await supabase
        .from("podcasts")
        .select("title,artist,audio_url,duration_seconds,published_at,status")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1);
      if (!error && data && data[0]) {
        const dur = (data[0] as any).duration_seconds as number | null;
        const m = dur ? Math.floor(dur / 60) : 0;
        const s = dur ? Math.floor(dur % 60) : 0;
        const duration = dur ? `${m}:${String(s).padStart(2, "0")}` : "";
        setLatestPodcast({
          title: (data[0] as any).title,
          artist: (data[0] as any).artist,
          date: (data[0] as any).published_at,
          duration,
          audioUrl: (data[0] as any).audio_url,
        });
      }
      setLoading((s) => ({ ...s, podcast: false }));
    };

    fetchPrayer();
    fetchPodcast();
  }, [supabase]);

  const [announcements, setAnnouncements] = React.useState<Array<{ id: string; title: string; body: string | null; link_url: string | null; pinned: boolean }>>([]);
  const [ministries, setMinistries] = React.useState<Array<{ id: string; name: string; short_desc: string | null }>>([]);
  const [smallGroups, setSmallGroups] = React.useState<Array<{ id: string; name: string; schedule: string | null }>>([]);
  const [loadingDiscover, setLoadingDiscover] = React.useState({ announcements: true, ministries: true, groups: true });

  const SAMPLE_ANNOUNCEMENTS = [
    { id: "1", title: "Baptism Class – Register", body: "Baptism class begins next month. Sign up at the Welcome Desk or online.", link_url: "/contact", pinned: true },
    { id: "2", title: "Volunteer Training", body: "Training for new volunteers this Saturday 10am in Main Hall.", link_url: "/contact", pinned: false },
  ];

  const SAMPLE_MINISTRIES = [
    { id: "1", name: "Worship Team", short_desc: "Serve in music and production." },
    { id: "2", name: "Kids Ministry", short_desc: "Invest in the next generation." },
    { id: "3", name: "Hospitality", short_desc: "Create a welcoming environment." },
    { id: "4", name: "Outreach", short_desc: "Love our community practically." },
  ];

  const SAMPLE_GROUPS = [
    { id: "1", name: "Young Adults", schedule: "Thursdays 7pm" },
    { id: "2", name: "Families", schedule: "Saturdays 5pm" },
    { id: "3", name: "Men's Study", schedule: "Wednesdays 6:30am" },
    { id: "4", name: "Women's Gathering", schedule: "Tuesdays 7pm" },
  ];

  React.useEffect(() => {
    let isMounted = true;

    const loadDiscover = async () => {
      if (!supabase) {
        if (!isMounted) return;
        setAnnouncements(SAMPLE_ANNOUNCEMENTS);
        setMinistries(SAMPLE_MINISTRIES);
        setSmallGroups(SAMPLE_GROUPS);
        setLoadingDiscover({ announcements: false, ministries: false, groups: false });
        return;
      }

      // Announcements
      const { data: anns } = await supabase
        .from("announcements")
        .select("id,title,body,link_url,pinned,starts_at,created_at,status")
        .eq("status", "published")
        .order("pinned", { ascending: false })
        .order("starts_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (isMounted) {
        setAnnouncements((anns as any[])?.map(a => ({
          id: a.id,
          title: a.title,
          body: a.body ?? null,
          link_url: a.link_url ?? null,
          pinned: Boolean(a.pinned),
        })) || []);
        setLoadingDiscover((s) => ({ ...s, announcements: false }));
      }

      // Ministries
      const { data: mins } = await supabase
        .from("ministries")
        .select("id,name,short_desc,status")
        .eq("status", "active")
        .order("name", { ascending: true });
      if (isMounted) {
        setMinistries((mins as any[])?.map(m => ({ id: m.id, name: m.name, short_desc: m.short_desc ?? null })) || []);
        setLoadingDiscover((s) => ({ ...s, ministries: false }));
      }

      // Small Groups
      const { data: groups } = await supabase
        .from("small_groups")
        .select("id,name,schedule,status")
        .eq("status", "active")
        .order("name", { ascending: true });
      if (isMounted) {
        setSmallGroups((groups as any[])?.map(g => ({ id: g.id, name: g.name, schedule: g.schedule ?? null })) || []);
        setLoadingDiscover((s) => ({ ...s, groups: false }));
      }
    };

    loadDiscover();
    return () => { isMounted = false; };
  }, [supabase]);

  const YT_VIDEO_ID = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID;
  const YT_CHANNEL_URL = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "#";

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <ComingSoonOverlay>
        <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t("common.backToHome")}
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{t("discover.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("discover.subtitle")}</p>
          </div>

          {/* Announcements */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">{t("discover.announcements")}</h2>
            </div>
            <div className="space-y-4">
              {loadingDiscover.announcements ? (
                <p className="text-sm text-muted-foreground">{t("discover.loading")}</p>
              ) : announcements.length > 0 ? (
                announcements.map(a => (
                  <div key={a.id} className="rounded-lg border border-border p-4 bg-background">
                    <h3 className="font-medium">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                    {a.link_url ? (
                      <div className="mt-3">
                        <Link href={a.link_url} className="text-sm text-accent hover:underline">{t("discover.learnMore")}</Link>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("discover.noAnnouncements")}</p>
              )}
            </div>
          </section>

          {/* Latest YouTube */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">{t("youtube.latest")}</h2>
            </div>
            {YT_VIDEO_ID ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-background">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${YT_VIDEO_ID}`}
                  title="KGIC YouTube"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border p-4 bg-background text-sm text-muted-foreground">
                {t("youtube.connect")}
                <div className="mt-2">
                  <Link href={YT_CHANNEL_URL} className="text-accent hover:underline">{t("youtube.openChannel")}</Link>
                </div>
              </div>
            )}
          </section>

          {/* Latest Morning Prayer */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">{t("nav.prayers")}</h2>
              </div>
              <Link href="/prayers" className="text-sm text-accent hover:underline">{t("common.viewAll")}</Link>
            </div>
            <div className="rounded-lg border border-border p-4 bg-background">
              {loading.prayer ? (
                <p className="text-sm text-muted-foreground">{t("prayers.loadingLatest")}</p>
              ) : latestPrayer ? (
                <div>
                  <h3 className="font-medium">{latestPrayer.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{latestPrayer.excerpt || ""}</p>
                  <p className="text-xs text-muted-foreground mt-2">{latestPrayer.date}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("prayers.none")}</p>
              )}
            </div>
          </section>

          {/* Latest Podcast */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">{t("podcasts.latest")}</h2>
              </div>
              <Link href="/podcasts" prefetch={false} className="text-sm text-accent hover:underline">{t("common.viewAll")}</Link>
            </div>
            <div className="rounded-lg border border-border p-4 bg-background">
              {loading.podcast ? (
                <p className="text-sm text-muted-foreground">{t("podcasts.loadingLatest")}</p>
              ) : latestPodcast ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{latestPodcast.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{latestPodcast.artist || t("podcasts.artistDefault")}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(latestPodcast.date)} {latestPodcast.duration ? `• ${latestPodcast.duration}` : ""}</p>
                  </div>
                  <div className="shrink-0">
                    <Link href="/podcasts" prefetch={false} className="inline-flex items-center text-sm rounded-full bg-accent text-accent-foreground px-3 py-1.5 hover:opacity-90">{t("podcasts.listen")}</Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("podcasts.none")}</p>
              )}
            </div>
          </section>

          {/* Ministries / Serving */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Church className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">{t("discover.ministriesHeading")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {loadingDiscover.ministries ? (
                <div className="rounded-lg border border-border p-4 bg-background text-sm text-muted-foreground">{t("discover.loadingMinistries")}</div>
              ) : ministries.length > 0 ? (
                ministries.map(m => (
                  <div key={m.id} className="rounded-lg border border-border p-4 bg-background">
                    <h3 className="font-medium">{m.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{m.short_desc}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-border p-4 bg-background text-sm text-muted-foreground">{t("discover.noMinistries")}</div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/contact" className="text-sm text-accent hover:underline">{t("discover.serveCta")}</Link>
            </div>
          </section>

          {/* Small Groups */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">{t("discover.groupsHeading")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {loadingDiscover.groups ? (
                <div className="rounded-lg border border-border p-4 bg-background text-sm text-muted-foreground">{t("discover.loadingGroups")}</div>
              ) : smallGroups.length > 0 ? (
                smallGroups.map(g => (
                  <div key={g.id} className="rounded-lg border border-border p-4 bg-background">
                    <h3 className="font-medium">{g.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{g.schedule}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-border p-4 bg-background text-sm text-muted-foreground">{t("discover.noGroups")}</div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/contact" className="text-sm text-accent hover:underline">{t("discover.findGroupCta")}</Link>
            </div>
          </section>
        </main>

        <Footer />
      </ComingSoonOverlay>
    </div>
  );
}