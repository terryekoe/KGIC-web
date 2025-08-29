-- Add play_count column to podcasts table
ALTER TABLE IF EXISTS public.podcasts
  ADD COLUMN IF NOT EXISTS play_count integer NOT NULL DEFAULT 0;

-- Optional: backfill nulls to 0 if column existed but was nullable
UPDATE public.podcasts SET play_count = 0 WHERE play_count IS NULL;