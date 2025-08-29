"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventCard } from "@/components/ui/event-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";

export default function EventsPage() {
  const { t } = useI18n();

  const events = [1, 2, 3].map((id) => ({
    id,
    title: t(`eventsPage.sample.${id}.title` as any),
    date: t(`eventsPage.sample.${id}.date` as any),
    location: t(`eventsPage.sample.${id}.location` as any),
    rsvp: "#",
  }));

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            {t("common.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t("eventsPage.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("eventsPage.subtitle")}</p>
        </div>

        <section className="grid sm:grid-cols-2 gap-6">
          {events.map((ev) => (
            <EventCard key={ev.id} id={ev.id} title={ev.title} date={ev.date} location={ev.location} rsvp={ev.rsvp} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}