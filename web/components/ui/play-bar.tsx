"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from "lucide-react";

interface PlayBarProps {
  isPlaying?: boolean;
  currentPodcast?: {
    id: number;
    title: string;
    artist: string;
    imageUrl?: string;
  };
  progress?: number; // 0-100
  volume?: number; // 0-100
  currentTime?: number; // in seconds
  duration?: number; // in seconds
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
}

// Helper function to format time in seconds to MM:SS
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function PlayBar({
  isPlaying = false,
  currentPodcast,
  progress = 0,
  volume = 70,
  currentTime = 0,
  duration = 0,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
}: PlayBarProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [tempProgress, setTempProgress] = React.useState(progress);

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  React.useEffect(() => {
    setTempProgress(progress);
  }, [progress]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setTempProgress(newProgress);
    if (!isDragging) {
      onSeek?.(newProgress);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onSeek?.(tempProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange?.(newVolume);
  };

  const hasTrack = !!currentPodcast;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="px-3 py-1">
        {/* Progress Bar */}
        <div className="mb-1">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="w-10 text-right">{hasTrack ? formattedCurrentTime : "0:00"}</span>
            <div className="flex-1 relative h-1">
              {/* Base track */}
              <div className="absolute inset-0 rounded-lg bg-muted" aria-hidden="true"></div>
              {/* Filled track with wave overlay */}
              <div
                className="absolute inset-y-0 left-0 rounded-lg overflow-hidden"
                style={{ width: `${hasTrack ? tempProgress : 0}%` }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-red-600/90" />
                <div className="absolute inset-0 wave-mask opacity-60" />
              </div>
              {/* Interactive slider (transparent track, visible thumb) */}
              <input
                type="range"
                min="0"
                max="100"
                value={hasTrack ? tempProgress : 0}
                onChange={hasTrack ? handleProgressChange : undefined}
                onMouseDown={hasTrack ? handleMouseDown : undefined}
                onMouseUp={hasTrack ? handleMouseUp : undefined}
                disabled={!hasTrack}
                className="progress-slider absolute inset-0 w-full h-1 appearance-none cursor-pointer disabled:cursor-not-allowed z-10"
                aria-label="Seek"
              />
            </div>
            <span className="w-10">{hasTrack ? formattedDuration : "0:00"}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Current Track Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
              {hasTrack && currentPodcast?.imageUrl ? (
                <img 
                  src={currentPodcast.imageUrl} 
                  alt={currentPodcast.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-[12px] truncate">{hasTrack ? currentPodcast!.title : "Select a podcast to start playing"}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{hasTrack ? currentPodcast!.artist : ""}</p>
            </div>
            <button className="p-1.5 hover:bg-muted rounded-full transition-colors hidden sm:block" disabled={!hasTrack}>
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-1.5 mx-3">
            <button className="p-1.5 hover:bg-muted rounded-full transition-colors hidden sm:block" disabled={!hasTrack}>
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={hasTrack ? onPrevious : undefined}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              disabled={!hasTrack}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={hasTrack ? onPlayPause : undefined}
              className={`${hasTrack ? "bg-red-600 hover:bg-red-700 text-white" : "bg-muted text-muted-foreground"} p-2 rounded-full transition-colors`}
              disabled={!hasTrack}
            >
              {hasTrack && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <button 
              onClick={hasTrack ? onNext : undefined}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              disabled={!hasTrack}
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full transition-colors hidden sm:block" disabled={!hasTrack}>
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Volume Control */}
          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="100"
                value={hasTrack ? volume : 0}
                onChange={hasTrack ? handleVolumeChange : undefined}
                disabled={!hasTrack}
                className="w-20 h-1 bg-transparent rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: hasTrack
                    ? `linear-gradient(to right, rgb(239 68 68) 0%, rgb(239 68 68) ${volume}%, rgb(156 163 175) ${volume}%, rgb(156 163 175) 100%)`
                    : `linear-gradient(to right, rgb(156 163 175) 0%, rgb(156 163 175) 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Make slider track transparent so the custom layers show through */
        .progress-slider { background: transparent !important; }
        .progress-slider::-webkit-slider-runnable-track { height: 3px; background: transparent; border-radius: 6px; }
        .progress-slider::-moz-range-track { height: 3px; background: transparent; border-radius: 6px; }

        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgb(239 68 68);
          cursor: pointer;
          border: none;
          margin-top: -3.5px; /* center the 10px thumb on the 3px track */
        }
        
        .progress-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgb(239 68 68);
          cursor: pointer;
          border: none;
        }

        /* Wave overlay using tiled inline SVG and smooth horizontal animation */
        .wave-mask {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='3' viewBox='0 0 200 3'><path d='M0 1.5 Q 25 0.5 50 1.5 T 100 1.5 T 150 1.5 T 200 1.5' fill='none' stroke='white' stroke-width='1.2' stroke-linecap='round' opacity='0.8'/></svg>");
          background-repeat: repeat-x;
          background-size: 200px 3px;
          animation: waveSlide 2.4s linear infinite;
          mix-blend-mode: overlay;
        }

        @keyframes waveSlide {
          from { background-position-x: 0; }
          to { background-position-x: 200px; }
        }
      `}</style>
    </div>
  );
}