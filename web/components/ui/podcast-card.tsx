"use client";

import { Download, PlayCircle, PauseCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PodcastCardProps {
  id: number;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
  artist?: string;
}

export function PodcastCard({ title, date, duration, audioUrl, artist = "KGIC" }: PodcastCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);
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
  }, []);

  useEffect(() => {
    // Detect if the current browser can play the file type (by extension)
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
    const audio = audioRef.current;
    if (!audio) return;
    if (!canPlay) {
      setPlayError("This audio format isn't supported by your browser. Please use Download to listen.");
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg break-words whitespace-normal">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1 break-words">
            {artist} • {date} • {duration}
          </p>
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

      {/* Progress Bar */}
      <div className="space-y-2">
        <div 
          className="w-full h-2 bg-muted rounded-full cursor-pointer"
          onClick={handleProgressClick}
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
      <audio ref={audioRef} src={audioUrl} preload="metadata" aria-hidden="true" onError={() => setPlayError("Playback failed. Please use Download to listen or try another browser.")} />
    </div>
  );
}