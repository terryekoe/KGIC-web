"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";

interface AudioState {
  isPlaying: boolean;
  currentPodcast: {
    id: string | number;
    title: string;
    artist: string;
    audioUrl: string;
    imageUrl?: string;
  } | null;
  progress: number;
  volume: number;
  duration: number;
  currentTime: number;
  // New fields to support playbar visibility logic across routes
  hasEverPlayed: boolean;
  lastPausedAt: number | null; // epoch ms of last pause/end
}

interface AudioContextType extends AudioState {
  playPodcast: (podcast: {
    id: string | number;
    title: string;
    artist: string;
    audioUrl: string;
    imageUrl?: string;
  }) => void;
  togglePlayPause: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  nextPodcast: () => void;
  previousPodcast: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentPodcast: null,
    progress: 0,
    volume: 70,
    duration: 0,
    currentTime: 0,
    hasEverPlayed: false,
    lastPausedAt: null,
  });

  // Initialize audio element
  React.useEffect(() => {
    if (audioRef.current) return; // guard against double-init in StrictMode
    audioRef.current = new Audio();
    const audio = audioRef.current;
    // Improve streaming stability across origins and avoid excessive preloading
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";

    const handleTimeUpdate = () => {
      if (audio.duration && audio.currentTime) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioState(prev => ({
          ...prev,
          progress,
          currentTime: audio.currentTime,
          duration: audio.duration,
        }));
      }
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, progress: 0, lastPausedAt: Date.now() }));
    };

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, hasEverPlayed: true, lastPausedAt: null }));
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, lastPausedAt: Date.now() }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.volume = audioState.volume / 100;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
    };
  }, []);

  // Helper: detect if a URL points to Supabase Storage
  const isSupabaseStorageUrl = (url: string) => {
    try {
      const u = new URL(url);
      return u.pathname.includes("/storage/v1/object/");
    } catch {
      return url.includes("/storage/v1/object/") || url.includes("supabase.co/storage/v1");
    }
  };

  // Helper: resolve a playable URL, signing if it is a Supabase Storage object
  const resolvePlayableUrl = async (url: string): Promise<string> => {
    if (!url || !isSupabaseStorageUrl(url)) return url;
    // If already a signed URL, don't try to re-sign it again
    try {
      const u = new URL(url);
      if (u.pathname.includes("/storage/v1/object/sign/") || u.searchParams.has("token")) {
        return url;
      }
    } catch {
      if (url.includes("/storage/v1/object/sign/") || url.includes("token=")) {
        return url;
      }
    }
    try {
      const res = await fetch("/api/podcasts/sign-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.url) return data.url as string;
      }
    } catch {
      // ignore and fall back
    }
    return url;
  };

  const playPodcast = useCallback((podcast: {
    id: string | number;
    title: string;
    artist: string;
    audioUrl: string;
    imageUrl?: string;
  }) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If it's the same podcast, just toggle play/pause
    if (audioState.currentPodcast?.id === podcast.id) {
      togglePlayPause();
      return;
    }

    // Optimistically set state so UI updates immediately
    setAudioState(prev => ({
      ...prev,
      currentPodcast: podcast,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      hasEverPlayed: true,
      lastPausedAt: null,
    }));

    // Fire-and-forget: increment play count on server for this podcast id
    try {
      fetch("/api/podcasts/increment-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: podcast.id }),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    // Resolve and start playback with signed URL when needed
    (async () => {
      const initialUrl = await resolvePlayableUrl(podcast.audioUrl);
      // Only reset src if it's actually different to avoid cancelling in-flight requests unnecessarily
      if (!audio.src || audio.src !== initialUrl) {
        audio.src = initialUrl;
      }
      try {
        await audio.play();
      } catch (err) {
        // Limit fallback attempts to Supabase Storage URLs only when signing failed (initialUrl === original)
        try {
          if (isSupabaseStorageUrl(podcast.audioUrl) && initialUrl === podcast.audioUrl) {
            const signed = await resolvePlayableUrl(podcast.audioUrl);
            if (signed && signed !== initialUrl) {
              audio.src = signed;
              await audio.play();
              return;
            }
          }
        } catch {}
        // Final failure: pause and mark not playing
        audio.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
        console.error(err);
      }
    })();
  }, [audioState.currentPodcast?.id]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioState.currentPodcast) return;

    if (audioState.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }

    // Do not manually set isPlaying here; rely on the media events (play/pause)
  }, [audioState.isPlaying, audioState.currentPodcast]);

  const seek = useCallback((position: number) => {
    const audio = audioRef.current;
    if (!audio || !audioState.duration) return;

    const seekTime = (position / 100) * audioState.duration;
    audio.currentTime = seekTime;
    setAudioState(prev => ({ ...prev, progress: position, currentTime: seekTime }));
  }, [audioState.duration]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
    setAudioState(prev => ({ ...prev, volume }));
  }, []);

  const nextPodcast = useCallback(() => {
    // TODO: Implement playlist functionality
    console.log("Next podcast");
  }, []);

  const previousPodcast = useCallback(() => {
    // TODO: Implement playlist functionality
    console.log("Previous podcast");
  }, []);

  const contextValue: AudioContextType = {
    ...audioState,
    playPodcast,
    togglePlayPause,
    seek,
    setVolume,
    nextPodcast,
    previousPodcast,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}