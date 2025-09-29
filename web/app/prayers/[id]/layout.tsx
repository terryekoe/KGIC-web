import { Metadata } from 'next';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        title: 'Prayer - The King\'s Generals International Church',
        description: 'A prayer from KGIC',
      };
    }

    const { data: prayer } = await supabase
      .from('prayers')
      .select('title, content, author, excerpt')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (!prayer) {
      return {
        title: 'Prayer Not Found - The King\'s Generals International Church',
        description: 'The requested prayer could not be found.',
      };
    }

    const title = `${prayer.title} - KGIC Prayer`;
    const description = prayer.excerpt || prayer.content.substring(0, 160).replace(/\n/g, ' ').trim() + '...';
    const author = prayer.author ? ` by ${prayer.author}` : '';
    
    return {
      title,
      description: `🙏 ${description}${author}`,
      openGraph: {
        title,
        description: `🙏 ${description}${author}`,
        type: 'article',
        url: `https://thekingsgenerals.com/prayers/${id}`,
        siteName: 'The King\'s Generals International Church',
        images: [
          {
            url: '/logo.png',
            width: 1200,
            height: 630,
            alt: 'KGIC Logo',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: `🙏 ${description}${author}`,
        images: ['/logo.png'],
        site: '@kgic',
      },
      other: {
        'og:image:alt': 'The King\'s Generals International Church Logo',
        'twitter:image:alt': 'The King\'s Generals International Church Logo',
      },
    };
  } catch (error) {
    console.error('Error generating prayer metadata:', error);
    return {
      title: 'Prayer - The King\'s Generals International Church',
      description: 'A prayer from KGIC',
      openGraph: {
        title: 'Prayer - The King\'s Generals International Church',
        description: 'A prayer from KGIC',
        images: ['/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Prayer - The King\'s Generals International Church',
        description: 'A prayer from KGIC',
        images: ['/logo.png'],
      },
    };
  }
}

export default function PrayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}