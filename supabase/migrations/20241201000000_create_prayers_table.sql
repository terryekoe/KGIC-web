-- Create prayers table for Morning Prayer management
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE prayers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  excerpt TEXT, -- Auto-generated from content first 150 chars
  is_featured BOOLEAN DEFAULT false, -- For today's prayer
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  scheduled_for DATE, -- When to publish/feature this prayer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_prayers_status ON prayers(status);
CREATE INDEX idx_prayers_scheduled_for ON prayers(scheduled_for);
CREATE INDEX idx_prayers_is_featured ON prayers(is_featured);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prayers_updated_at 
    BEFORE UPDATE ON prayers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO prayers (title, content, author, is_featured, status, scheduled_for) VALUES 
(
  'Morning Blessing',
  'Dear Heavenly Father,

As we begin this new day, we come before You with grateful hearts. Thank You for the gift of life, for the breath in our lungs, and for Your endless mercy that is new every morning.

Grant us wisdom to make decisions that honor You. Give us strength to face whatever challenges may come our way today. Help us to be a light to those around us, showing Your love through our words and actions.

Protect our families, our community, and all those we hold dear. Guide our church as we serve You and serve others in Your name.

We ask all these things in the precious name of Jesus Christ, our Lord and Savior.

Amen.',
  'Pastor David',
  true,
  'published',
  CURRENT_DATE
),
(
  'Evening Gratitude',
  'Thank You, Lord, for walking with us through this day. We are grateful for Your constant presence and guidance. As we rest, may Your peace fill our hearts and homes.',
  'Pastor Sarah',
  false,
  'published',
  CURRENT_DATE - INTERVAL '1 day'
),
(
  'Strength for Trials',
  'In times of difficulty, we turn to You for comfort and strength. Help us remember that You are always with us, even in our darkest moments. Grant us the courage to face each challenge with faith.',
  'Pastor David',
  false,
  'published',
  CURRENT_DATE - INTERVAL '2 days'
);

-- Enable Row Level Security (RLS) and add policies for authenticated users
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prayers_select_authenticated" ON public.prayers
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "prayers_insert_authenticated" ON public.prayers
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "prayers_update_authenticated" ON public.prayers
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "prayers_delete_authenticated" ON public.prayers
    FOR DELETE TO authenticated
    USING (true);

GRANT ALL ON TABLE public.prayers TO authenticated;
GRANT ALL ON TABLE public.prayers TO service_role;