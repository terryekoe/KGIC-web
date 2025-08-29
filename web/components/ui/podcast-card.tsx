"use client";

import { Download, PlayCircle, PauseCircle, Music } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useAudio } from "@/components/ui/audio-provider";

interface PodcastCardProps {
  id: string | number;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
  artist?: string;
  imageUrl?: string;
  description?: string;
  playCount?: number; // added
}

export function PodcastCard({ id, title, date, duration, audioUrl, artist = "KGIC", imageUrl, description, playCount = 0 }: PodcastCardProps) {
  // Remove local <audio> element usage; rely on global AudioProvider instead
  const [canPlay, setCanPlay] = useState(true);
  const [playError, setPlayError] = useState<string | null>(null);
  const audio = useAudio();

  // local display of play count with one-time optimistic bump when this track is started
  const [localPlayCount, setLocalPlayCount] = useState<number>(playCount);
  const hasIncrementedOnceRef = useRef<boolean>(false);

  // Determine if this card is the one currently playing via global audio state
  const isThis = !!audio && audio.currentPodcast?.id === id;
  const isPlaying = !!audio && isThis && audio.isPlaying;

  // Detect if the current browser can play the file type (by extension)
  useEffect(() => {
    setPlayError(null);
    try {
      const tester = document.createElement("audio");
      const url = audioUrl || "";
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
        setPlayError("This audio format isn't supported by your browser. Please use Download to listen.");
      }
      setCanPlay(supported);
    } catch {
      setCanPlay(true);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!canPlay) {
      setPlayError("This audio format isn't supported by your browser. Please use Download to listen.");
      return;
    }
    if (!audio) return;

    if (!isThis) {
      // optimistic UI increment once per session for this card
      if (!hasIncrementedOnceRef.current) {
        setLocalPlayCount((c) => c + 1);
        hasIncrementedOnceRef.current = true;
      }
      audio.playPodcast({ id, title, artist: artist || "KGIC", audioUrl, imageUrl });
    } else {
      audio.togglePlayPause();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-start gap-4 w-full">
          {/* Artwork */}
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Artwork" className="w-full h-full object-cover" />
            ) : (
              <Music className="w-7 h-7 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg break-words whitespace-normal">{title}</h3>
            <p className="text-muted-foreground text-sm mt-1 break-words">
              {artist} • {date} • {duration} • <span title="Play count">{localPlayCount}</span> plays
            </p>
            {/* Description */}
            {(description || !description) && (
              <p className="text-muted-foreground/90 text-sm mt-2 break-words leading-relaxed">
                {description || "Join us for this inspiring message filled with biblical wisdom and practical insights for your spiritual journey. Experience God's word in a fresh way as we explore timeless truths that transform lives."}
              </p>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto grid grid-cols-2 gap-2 sm:flex sm:gap-2 mt-3 sm:mt-0">
          <button 
            onClick={togglePlay}
            disabled={!canPlay}
            className={`w-full sm:w-auto inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base ${canPlay ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`}
          >
            {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <a 
            download 
            href={audioUrl} 
            className="w-full sm:w-auto inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-muted"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>

      {playError && (
        <p className="text-xs text-amber-600 mb-2">{playError}</p>
      )}

      {/* Removed local progress visualization tied to card-level audio */}
      {/* Previously there was a hidden progress bar; removed to prevent unused references */}

      {/* Removed hidden <audio> element to avoid duplicate network requests that cause net::ERR_ABORTED */}
    </div>
  );
}