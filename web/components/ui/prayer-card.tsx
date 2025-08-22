import { Calendar, Clock } from "lucide-react";
import { parseAndRenderTextWithHtml } from "@/lib/textUtils";
import Link from "next/link";

interface PrayerCardProps {
  id?: string | number;
  title: string;
  date: string;
  content?: string;
  excerpt?: string;
  author?: string;
  showActions?: boolean;
  variant?: "full" | "preview";
}

export function PrayerCard({ 
  id,
  title, 
  date, 
  content, 
  excerpt, 
  author, 
  showActions = true, 
  variant = "preview" 
}: PrayerCardProps) {
  if (variant === "full") {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-2 text-accent text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Today's Prayer
          </span>
          <span className="text-muted-foreground text-sm">{date}</span>
          {author && <span className="text-muted-foreground text-sm">by {author}</span>}
        </div>

        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        {content && (
          <div className="prose prose-invert max-w-none">
            {/* Preserve line breaks and allow **bold** or <b>/<strong> inline */}
            <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
              {parseAndRenderTextWithHtml(content)}
            </div>
          </div>
        )}

        {showActions && (
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 hover:opacity-90">
              <Clock className="w-4 h-4" />
              Set Daily Reminder
            </button>
            <button className="inline-flex items-center rounded-full border border-border px-6 py-3 hover:bg-muted">
              Share Prayer
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-6 bg-card hover:bg-muted transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold mb-2">{title}</h4>
          {excerpt && <p className="text-muted-foreground text-sm mb-3">{excerpt}</p>}
          <span className="text-muted-foreground text-xs">{date}</span>
        </div>
        <Link href={typeof id !== 'undefined' ? `/prayers/${id}` : '/prayers'} className="text-accent hover:text-accent/80 text-sm font-medium">
          Read →
        </Link>
      </div>
    </div>
  );
}