"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAudio } from "@/components/ui/audio-provider";
import { PlayBar } from "@/components/ui/play-bar";

export function PlayBarWrapper() {
  const pathname = usePathname();
  const {
    isPlaying,
    currentPodcast,
    progress,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    seek,
    setVolume,
    nextPodcast,
    previousPodcast,
    hasEverPlayed,
    lastPausedAt,
  } = useAudio();

  const onPodcastsPage = pathname?.startsWith("/podcasts") ?? false;

  // Local tick to re-render while counting down pause timeout on non-podcast pages
  const [, setTick] = React.useState<number>(0);
  React.useEffect(() => {
    if (onPodcastsPage) return; // no need to tick on podcasts page (always visible)

    // If we are paused and have a pause timestamp, tick every second to update visibility
    if (!isPlaying && lastPausedAt) {
      const id = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(id);
    }
  }, [onPodcastsPage, isPlaying, lastPausedAt]);

  const showDueToRecentPause = !isPlaying && !!lastPausedAt && (Date.now() - lastPausedAt < 60_000);
  const shouldShow = onPodcastsPage || isPlaying || (hasEverPlayed && showDueToRecentPause);

  if (!shouldShow) return null;

  return (
    <PlayBar
      isPlaying={isPlaying}
      currentPodcast={currentPodcast ? {
        id: Number(currentPodcast.id),
        title: currentPodcast.title,
        artist: currentPodcast.artist,
        imageUrl: currentPodcast.imageUrl
      } : undefined}
      progress={progress}
      volume={volume}
      currentTime={currentTime}
      duration={duration}
      onPlayPause={togglePlayPause}
      onSeek={seek}
      onVolumeChange={setVolume}
      onNext={nextPodcast}
      onPrevious={previousPodcast}
    />
  );
}