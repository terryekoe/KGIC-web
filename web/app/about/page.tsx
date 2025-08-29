"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            {t("common.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t("aboutPage.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-prose">
            {t("aboutPage.description")}
          </p>
        </div>

        {/* Vision */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">{t("aboutPage.visionTitle")}</h2>
            <p className="text-muted-foreground">
              {t("aboutPage.visionText")}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">{t("aboutPage.missionTitle")}</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><span className="font-semibold">1.</span> {t("aboutPage.mission1")}</p>
              <p><span className="font-semibold">2.</span> {t("aboutPage.mission2")}</p>
              <p><span className="font-semibold">3.</span> {t("aboutPage.mission3")}</p>
            </div>
          </div>
        </section>

        {/* Leadership & Location */}
        <section className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-3 text-accent">{t("aboutPage.leadershipTitle")}</h3>
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground">{t("aboutPage.leadPastorLabel")}</p>
              <p>{t("aboutPage.leadPastorName")}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-3 text-accent">{t("aboutPage.locationTitle")}</h3>
            <div className="text-muted-foreground space-y-2">
              <p className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                {t("aboutPage.locationVenue")}
              </p>
              <p>{t("aboutPage.locationAddress")}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}