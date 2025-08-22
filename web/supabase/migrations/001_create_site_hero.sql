-- Migration: Create site_hero table for homepage hero section management
-- Created: 2025-01-18

-- Create the site_hero table
CREATE TABLE IF NOT EXISTS public.site_hero (
    id TEXT PRIMARY KEY DEFAULT 'default',
    images TEXT[] DEFAULT '{}',
    video_url TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER site_hero_updated_at
    BEFORE UPDATE ON public.site_hero
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_hero ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read site_hero" ON public.site_hero
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert site_hero" ON public.site_hero
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site_hero" ON public.site_hero
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default row
INSERT INTO public.site_hero (id, images, video_url)
VALUES ('default', '{}', NULL)
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.site_hero TO authenticated;
GRANT ALL ON public.site_hero TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS site_hero_updated_at_idx ON public.site_hero(updated_at);

-- Comments for documentation
COMMENT ON TABLE public.site_hero IS 'Stores hero section configuration for the homepage including image URLs and video URL';
COMMENT ON COLUMN public.site_hero.id IS 'Primary key, typically "default" for single hero configuration';
COMMENT ON COLUMN public.site_hero.images IS 'Array of image URLs for hero background slideshow';
COMMENT ON COLUMN public.site_hero.video_url IS 'Optional video URL for hero background (MP4 format recommended)';
COMMENT ON COLUMN public.site_hero.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN public.site_hero.updated_at IS 'Timestamp when record was last updated';