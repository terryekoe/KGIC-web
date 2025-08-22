import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventCard } from "@/components/ui/event-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function EventsPage() {
  const events = [
    { id: 1, title: "Sunday Worship Service", date: "Sun, Sep 15 • 9:00 AM", location: "KGIC Main Hall", rsvp: "#" },
    { id: 2, title: "Youth Bible Study", date: "Wed, Sep 18 • 6:30 PM", location: "Room 204", rsvp: "#" },
    { id: 3, title: "Community Outreach", date: "Sat, Sep 21 • 10:00 AM", location: "City Center", rsvp: "#" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-muted-foreground text-lg">Join us and be part of the community</p>
        </div>

        <section className="grid sm:grid-cols-2 gap-6">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              id={ev.id}
              title={ev.title}
              date={ev.date}
              location={ev.location}
              rsvp={ev.rsvp}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}