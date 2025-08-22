import { CalendarDays, MapPin } from "lucide-react";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  rsvp?: string;
}

export function EventCard({ title, date, location, rsvp }: EventCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="text-accent inline-flex items-center gap-2 text-sm font-medium mb-3">
        <CalendarDays className="w-4 h-4" />
        {date}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <div className="text-muted-foreground text-sm inline-flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {location}
      </div>
      {rsvp && (
        <div className="mt-6">
          <a href={rsvp} className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-4 py-2 hover:opacity-90">
            RSVP
          </a>
        </div>
      )}
    </div>
  );
}