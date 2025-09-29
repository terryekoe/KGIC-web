"use client";

import Link from "next/link";
import { ArrowLeft, Radio, Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";
import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay";

export default function LivePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <ComingSoonOverlay>
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t("common.backToHome")}
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{t("livePage.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("livePage.subtitle")}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">{t("home.theme.yearLabel")}</span>
                <span className="text-foreground/90">{t("home.theme.yearTitle")}</span>
              </div>
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">{t("home.theme.monthLabel")}</span>
                <span className="text-foreground/90">{t("home.theme.monthTitle")}</span>
              </div>
            </div>
          </div>

          <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-xl">{t("livePage.currentlyLive")}</h2>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center text-muted-foreground">
              <p>{t("livePage.streamPlaceholder")}</p>
            </div>
            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t("livePage.serviceInfo.sunday")} • {t("livePage.serviceInfo.thursday")}</span>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">{t("livePage.missedService.title")}</h3>
            <p className="text-muted-foreground">
              {t("livePage.missedService.description")} {" "}
              <Link href="/podcasts" prefetch={false} className="text-accent">{t("livePage.missedService.podcastsLink")}</Link> {" "}
              {t("common.viewAll")}
              {" "}
              <span className="mx-1">•</span>
              <Link href="/prayers" className="text-accent">{t("livePage.missedService.prayersLink")}</Link>
            </p>
          </section>
        </main>

        <Footer />
      </ComingSoonOverlay>
    </div>
  );
}