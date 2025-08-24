"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Share2, Link2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

const heroImages = [
  "/hero/slide-1.jpeg",
  "/hero/slide-2.jpeg", 
  "/hero/slide-3.jpeg",
  "/hero/slide-4.jpeg",
  "/hero/slide-5.jpeg",
  "/hero/slide-6.jpeg",
  "/hero/slide-7.jpeg",
  "/hero/slide-8.jpeg"
];

function NextServiceCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextService, setNextService] = useState("");

  useEffect(() => {
    function getNextService() {
      const now = new Date();
      const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Sunday Impact Service: 8:30 AM (510 minutes from midnight)
      if (today === 0 && currentTime < 510) {
        const target = new Date(now);
        target.setHours(8, 30, 0, 0);
        return { target, name: "Sunday Impact Service" };
      }
      
      // Thursday Communion Service: 6:00 PM (1080 minutes from midnight) 
      if (today === 4 && currentTime < 1080) {
        const target = new Date(now);
        target.setHours(18, 0, 0, 0);
        return { target, name: "Thursday Communion Service" };
      }
      
      // Next Sunday Impact Service
      const nextSunday = new Date(now);
      const daysUntilSunday = (7 - today) % 7 || 7;
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(8, 30, 0, 0);
      
      return { target: nextSunday, name: "Sunday Impact Service" };
    }

    function updateCountdown() {
      const { target, name } = getNextService();
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
      setNextService(name);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-accent/25">
      <div className="text-center">
        <h3 className="text-accent font-semibold mb-1 text-xs sm:text-sm">Next Service</h3>
        <p className="text-foreground/90 text-[11px] sm:text-xs mb-2">{nextService}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="bg-foreground/10 rounded-lg p-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">{timeLeft.days}</div>
            <div className="text-[10px] sm:text-[11px] text-foreground/70">DAYS</div>
          </div>
          <div className="bg-foreground/10 rounded-lg p-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">{timeLeft.hours}</div>
            <div className="text-[10px] sm:text-[11px] text-foreground/70">HOURS</div>
          </div>
          <div className="bg-foreground/10 rounded-lg p-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">{timeLeft.minutes}</div>
            <div className="text-[10px] sm:text-[11px] text-foreground/70">MINS</div>
          </div>
          <div className="bg-foreground/10 rounded-lg p-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">{timeLeft.seconds}</div>
            <div className="text-[10px] sm:text-[11px] text-foreground/70">SECS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentPodcast() {
  const supabase = getSupabaseClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState<{
    title: string;
    date: string;
    durationLabel: string;
    audioUrl: string;
    artist: string;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  const [playError, setPlayError] = useState<string | null>(null);

  const formatDuration = (s?: number | null) => {
    if (!s || s <= 0) return "";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchLatest = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("podcasts")
        .select("title,artist,audio_url,duration_seconds,published_at,status")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1);
      if (!error && data && data[0]) {
        const d: any = data[0];
        setEpisode({
          title: d.title,
          artist: d.artist || "KGIC",
          audioUrl: d.audio_url,
          durationLabel: formatDuration(d.duration_seconds),
          date: d.published_at ? new Date(d.published_at).toLocaleDateString() : "",
        });
      }
      setLoading(false);
    };
    fetchLatest();
  }, [supabase]);

  useEffect(() => {
    // Detect if this browser can play the episode's audio type based on extension
    setPlayError(null);
    try {
      const url = episode?.audioUrl || "";
      if (!url) { setCanPlay(true); return; }
      const tester = document.createElement("audio");
      const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
      let supported = true;
      const has = (t: string) => !!tester.canPlayType(t);
      if (ext === "mp3") {
        supported = has("audio/mpeg");
      } else if (ext === "m4a" || ext === "mp4") {
        supported = has("audio/mp4");
      } else if (ext === "ogg" || ext === "opus" || ext === "oga") {
        supported = has('audio/ogg; codecs="opus"') || has("audio/ogg");
      }
      if (!supported) {
        setPlayError("This audio format isn't supported by your browser. Please use the Download button.");
      }
      setCanPlay(supported);
    } catch {
      setCanPlay(true);
    }
  }, [episode?.audioUrl]);

  // NEW: Sync UI with audio element events so the Play/Pause state and progress update correctly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [episode?.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !episode?.audioUrl) return;
    if (!canPlay) {
      setPlayError("This audio format isn't supported by your browser. Please use the Download button.");
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !totalDuration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * totalDuration;

    audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const onCopy = async () => {
    try {
      const url = `${window.location.origin}/podcasts`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore
    }
  };

  const onShare = async () => {
    const url = `${window.location.origin}/podcasts`;
    try {
      if (navigator.share) {
        await navigator.share({ title: episode?.title || "Podcasts", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (e) {
      // user cancelled or error
    }
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  const hasEpisode = Boolean(episode && episode.audioUrl);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg break-words whitespace-normal">
            {loading ? "Loading..." : episode?.title || "No recent podcast"}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 break-words">
            {episode ? (
              <>
                {episode.artist} • {episode.date || ""} • {episode.durationLabel || ""}
              </>
            ) : (
              loading ? "Fetching latest podcast..." : "Check back soon for new episodes."
            )}
          </p>
        </div>
        <div className="w-full sm:w-auto grid grid-cols-2 gap-2 sm:flex sm:gap-2 mt-3 sm:mt-0">
          <button
            onClick={togglePlay}
            disabled={!hasEpisode || !canPlay}
            className={`w-full sm:w-auto inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base ${hasEpisode && canPlay ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <a
            download
            href={hasEpisode ? episode!.audioUrl : "#"}
            aria-disabled={!hasEpisode}
            className={`w-full sm:w-auto inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base ${hasEpisode ? "hover:bg-muted" : "opacity-60 pointer-events-none"}`}
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>

      {playError && (
        <p className="text-xs text-amber-600 mb-2">{playError}</p>
      )}

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div
          className={`w-full h-2 rounded-full ${hasEpisode ? "bg-muted cursor-pointer" : "bg-muted/50 cursor-default"}`}
          onClick={hasEpisode ? handleProgressClick : undefined}
        >
          <div
            className="h-2 bg-accent rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Hidden audio element */}
      {hasEpisode ? (
        <audio
          ref={audioRef}
          src={episode!.audioUrl}
          preload="metadata"
          aria-hidden="true"
          onLoadedMetadata={(e) => setTotalDuration((e.currentTarget as HTMLAudioElement).duration || 0)}
          onError={() => setPlayError("Playback failed. Please use the Download button or try another browser.")}
        />
      ) : null}
    </div>
  );
}

function RecentPrayer() {
  const [prayer, setPrayer] = useState<{ title: string; excerpt: string | null; date: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
    if (!supabaseUrl || !supabaseKey) {
      setLoading(false);
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    (async () => {
      try {
        const { data, error } = await supabase
          .from("prayers")
          .select("title,excerpt,scheduled_for,created_at")
          .eq("status", "published")
          .order("scheduled_for", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data[0]) {
          const d = (data[0] as any).scheduled_for ?? (data[0] as any).created_at;
          setPrayer({
            title: (data[0] as any).title,
            excerpt: (data[0] as any).excerpt ?? null,
            date: new Date(d).toLocaleDateString(),
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-flex items-center text-xs font-medium text-accent mb-2">Recently Posted Morning Prayer</span>
          <h3 className="font-semibold text-lg mb-1 break-words whitespace-normal">{loading ? "Loading..." : prayer?.title || "No recent prayer"}</h3>
          <p className="text-muted-foreground text-sm mb-3 break-words whitespace-normal">{loading ? "Please wait while we fetch the latest prayer." : (prayer?.excerpt || "Check back soon for today's prayer.")}</p>
          <span className="text-muted-foreground text-xs">{loading ? "" : (prayer?.date || "")}</span>
        </div>
        <Link href="/prayers" className="w-full sm:w-auto self-stretch sm:self-start inline-flex justify-center items-center rounded-full bg-accent text-accent-foreground font-semibold px-4 py-2 hover:opacity-90 mt-3 sm:mt-0">
          Read now
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.getBoundingClientRect().height);
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div className="min-h-[100svh] w-full bg-background text-foreground">
      <Header />

      <main className="relative">
        {/* Hero with Background Slider */}
        <section className="relative min-h-[100svh] flex items-center overflow-hidden" style={{ marginTop: -headerHeight, paddingTop: headerHeight }}>
          {/* Background Images */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100 kenburns' : 'opacity-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`Church background ${index + 1}`}
                  fill
                  className="object-cover will-change-transform"
                  priority={index === 0}
                  loading={index !== 0 && index === currentSlide ? "eager" : undefined}
                  sizes="100vw"
                  placeholder={index === 0 ? undefined : "empty"}
                />
              </div>
            ))}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-background/70 md:bg-background/60"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh]">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  <span className="block text-foreground drop-shadow-lg">FIND JESUS</span>
                  <span className="block text-foreground drop-shadow-lg">FIND HOPE</span>
                  <span className="block text-accent drop-shadow-lg">FIND PURPOSE</span>
                </h1>
                <p className="text-foreground/90 text-base sm:text-lg md:text-2xl max-w-prose drop-shadow-md">
                  We are a Christ-centered church raising responsible kingdom labourers.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link href="/prayers" className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 hover:bg-accent/90 transition-colors shadow-lg text-sm sm:text-base">
                    Today's Prayer
                  </Link>
                  <Link href="/podcasts" className="inline-flex items-center rounded-full border-2 border-foreground/30 bg-foreground/10 backdrop-blur-sm px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 hover:bg-foreground/20 transition-colors shadow-lg text-sm sm:text-base">
                    Explore Podcasts
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <NextServiceCountdown />
                {/* Extra panel removed */}
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 sm:w-2.5 sm:h-2.5 md:w-2 md:h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-accent' : 'bg-foreground/40'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="py-10 sm:py-14 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-xl border border-border p-5 sm:p-6 bg-card">
              <h3 className="font-semibold text-base sm:text-lg">Morning Prayer</h3>
              <p className="text-sm text-muted-foreground mt-1.5 sm:mt-2">Start your day with a guided prayer. Updated daily.</p>
              <Link href="/prayers" className="mt-3 sm:mt-4 inline-block text-accent">Read today’s prayer →</Link>
            </div>
            <div className="rounded-xl border border-border p-5 sm:p-6 bg-card">
              <h3 className="font-semibold text-base sm:text-lg">Podcasts</h3>
              <p className="text-sm text-muted-foreground mt-1.5 sm:mt-2">Listen to sermons and messages on the go.</p>
              <Link href="/podcasts" className="mt-3 sm:mt-4 inline-block text-accent">Play latest episode →</Link>
            </div>
            <div className="rounded-xl border border-border p-5 sm:p-6 bg-card">
              <h3 className="font-semibold text-base sm:text-lg">Events</h3>
              <p className="text-sm text-muted-foreground mt-1.5 sm:mt-2">Stay updated with what’s happening at KGIC.</p>
              <Link href="/events" className="mt-3 sm:mt-4 inline-block text-accent">See upcoming events →</Link>
            </div>
          </div>
        </section>

        {/* Recent content */}
        <section className="pb-16 sm:pb-20 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Latest from KGIC</h2>
              <p className="text-muted-foreground">Catch up with the most recent podcast and today’s morning prayer.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-secondary-accent">Recently Uploaded Podcast</h3>
                <RecentPodcast />
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-secondary-accent">Recently Posted Morning Prayer</h3>
                <RecentPrayer />
              </div>
            </div>
          </div>
        </section>

        {/* Themes Section moved here */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-accent/5 p-8 sm:p-10 min-h-[50svh] flex items-center">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide">Theme of the Year</p>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-foreground mt-2">GREATER THINGS</h2>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide">Theme of the Month</p>
                  <p className="text-base sm:text-xl md:text-2xl text-foreground/90 mt-2">AUGUST 2025: BECAUSE I KNOW WHO I AM, I AM BUILT TO OVERCOME AND WIN</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
