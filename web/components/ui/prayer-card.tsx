'use client';

import { Calendar, Clock, Share2 } from "lucide-react";
import { parseAndRenderTextWithHtml, parsePrayerContent } from "@/lib/textUtils";
import { shareContent, generateShareUrl, generateShareText } from "@/lib/shareUtils";
import { ShareModal } from "./share-modal";
import { ReminderModal } from "./reminder-modal";
import Link from "next/link";
import { useState } from "react";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleShare = async () => {
    if (!id) return;
    
    const shareUrl = generateShareUrl(id);
    const shareText = generateShareText(title);
    
    const shared = await shareContent({
      title,
      text: shareText,
      url: shareUrl
    });
    
    // If Web Share API failed or not available, show fallback modal
    if (!shared) {
      setShowShareModal(true);
    }
  };
  if (variant === "full") {
    // Parse the content to separate references from prayer text
    const { references, prayerText } = parsePrayerContent(content || '');

    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
          {author && <span>• {author}</span>}
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        
        {/* Display scripture references first if they exist */}
        {references && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-accent">
            <div className="text-sm font-medium text-muted-foreground mb-2">Scripture References</div>
            <div className="text-foreground/90 leading-relaxed">
              {parseAndRenderTextWithHtml(references.replace(/^References:\s*/i, ''))}
            </div>
          </div>
        )}

        {/* Display the main prayer content */}
        {prayerText && (
          <div className="prose prose-invert max-w-none">
            {/* Preserve line breaks and allow **bold** or <b>/<strong> inline */}
            <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
              {parseAndRenderTextWithHtml(prayerText)}
            </div>
          </div>
        )}

        {showActions && (
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => setShowReminderModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 hover:opacity-90"
            >
              <Clock className="w-4 h-4" />
              Set Daily Reminder
            </button>
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 hover:bg-muted"
            >
              <Share2 className="w-4 h-4" />
              Share Prayer
            </button>
          </div>
        )}

        {/* Share Modal */}
        {id && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            title={title}
            url={generateShareUrl(id)}
            text={generateShareText(title)}
          />
        )}

        {/* Reminder Modal */}
        {id && (
          <ReminderModal
            isOpen={showReminderModal}
            onClose={() => setShowReminderModal(false)}
            prayerTitle={title}
            prayerId={id}
          />
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