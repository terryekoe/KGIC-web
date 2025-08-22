-- Migration: Create prayers table for Morning Prayer management
-- Created: 2025-01-18

-- Create the prayers table
CREATE TABLE IF NOT EXISTS public.prayers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT NULL,
    excerpt TEXT DEFAULT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    scheduled_for DATE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER prayers_updated_at
    BEFORE UPDATE ON public.prayers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read prayers" ON public.prayers
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert prayers" ON public.prayers
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update prayers" ON public.prayers
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete prayers" ON public.prayers
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT ALL ON public.prayers TO authenticated;
GRANT ALL ON public.prayers TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS prayers_status_idx ON public.prayers(status);
CREATE INDEX IF NOT EXISTS prayers_scheduled_for_idx ON public.prayers(scheduled_for);
CREATE INDEX IF NOT EXISTS prayers_is_featured_idx ON public.prayers(is_featured);
CREATE INDEX IF NOT EXISTS prayers_created_at_idx ON public.prayers(created_at);

-- Insert sample data
INSERT INTO public.prayers (title, content, author, excerpt, is_featured, status, scheduled_for) VALUES
('Morning Blessing', 'Dear Heavenly Father,

As we begin this new day, we come before You with grateful hearts. Thank You for the gift of life, for the breath in our lungs, and for Your endless mercy that is new every morning.

Grant us wisdom to make decisions that honor You. Give us strength to face whatever challenges may come our way today. Help us to be a light to those around us, showing Your love through our words and actions.

Protect our families, our community, and all those we hold dear. Guide our church as we serve You and serve others in Your name.

We ask all these things in the precious name of Jesus Christ, our Lord and Savior.

Amen.', 'Pastor David', 'Dear Heavenly Father, As we begin this new day, we come before You with grateful hearts. Thank You for the gift of life, for the breath in our lungs, and for Your endless mercy that is new every morning.', true, 'published', CURRENT_DATE),

('Evening Gratitude', 'Gracious God,

As the day comes to a close, we gather our thoughts to thank You for Your constant presence. You have walked with us through every moment, blessing us in ways we may not even realize.

Thank You for the opportunities You provided today to serve others and grow in faith. Forgive us for the moments when we fell short of Your glory, and help us to learn from our mistakes.

As we rest tonight, fill our hearts with peace. Protect us through the night and prepare us for tomorrow''s journey.

In Jesus'' name we pray.

Amen.', 'Pastor Sarah', 'Gracious God, As the day comes to a close, we gather our thoughts to thank You for Your constant presence. You have walked with us through every moment, blessing us in ways we may not even realize.', false, 'published', CURRENT_DATE - INTERVAL '1 day'),

('Strength for Trials', 'Almighty God,

In times of difficulty and uncertainty, we turn to You as our source of strength and comfort. You are our refuge and fortress, our God in whom we trust.

When the storms of life seem overwhelming, remind us that You are greater than any challenge we face. Help us to lean not on our own understanding, but to trust in Your perfect plan.

Give us courage to face each day with faith, knowing that You work all things together for good for those who love You.

May Your peace, which surpasses all understanding, guard our hearts and minds.

In Christ''s name we pray.

Amen.', 'Deacon Mark', 'Almighty God, In times of difficulty and uncertainty, we turn to You as our source of strength and comfort. You are our refuge and fortress, our God in whom we trust.', false, 'published', CURRENT_DATE - INTERVAL '2 days')

ON CONFLICT (id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.prayers IS 'Stores morning prayers for church services and daily devotionals';
COMMENT ON COLUMN public.prayers.id IS 'Unique identifier for each prayer';
COMMENT ON COLUMN public.prayers.title IS 'Title of the prayer';
COMMENT ON COLUMN public.prayers.content IS 'Full text content of the prayer';
COMMENT ON COLUMN public.prayers.author IS 'Author of the prayer (optional)';
COMMENT ON COLUMN public.prayers.excerpt IS 'Brief excerpt/summary for listing views';
COMMENT ON COLUMN public.prayers.is_featured IS 'Whether this prayer is featured as today''s prayer';
COMMENT ON COLUMN public.prayers.status IS 'Publication status: draft, published, or archived';
COMMENT ON COLUMN public.prayers.scheduled_for IS 'Date when prayer is scheduled to be featured (optional)';
COMMENT ON COLUMN public.prayers.created_at IS 'Timestamp when prayer was created';
COMMENT ON COLUMN public.prayers.updated_at IS 'Timestamp when prayer was last updated';