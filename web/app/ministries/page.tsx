"use client";

import Link from "next/link";
import { ArrowLeft, Users, Mail } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";
import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay";

export default function MinistriesPage() {
  const { t } = useI18n();

  const ministries = [
    { key: "ministries.worship", contact: "worship@kgic.org" },
    { key: "ministries.youth", contact: "ayac@kgic.org" },
    { key: "ministries.children", contact: "children@kgic.org" },
    { key: "ministries.outreach", contact: "outreach@kgic.org" },
    { key: "ministries.hospitality", contact: "hospitality@kgic.org" },
    { key: "ministries.prayer", contact: "prayer@kgic.org" },
  ];

  const scfRowsKeys = ["glory", "restoration", "impactPlus", "victory"] as const;
  const scfRows = scfRowsKeys.map((k) => {
    const base = {
      name: t(`ministriesPage.smallGroups.rows.${k}.name`),
      day: t(String(t(`ministriesPage.smallGroups.rows.${k}.day`))),
      time: t(`ministriesPage.smallGroups.rows.${k}.time`),
      venue: t(`ministriesPage.smallGroups.rows.${k}.venue`),
    };
    return base;
  });

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <ComingSoonOverlay>
        <main className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t("common.backToHome")}
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{t("ministriesPage.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("ministriesPage.subtitle")}</p>
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

          <section className="grid sm:grid-cols-2 gap-6">
            {ministries.map((m) => (
              <div key={m.key} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold text-xl">{t(`ministriesPage.${m.key}.name`)}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{t(`ministriesPage.${m.key}.description`)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t("common.contact")}: <a className="text-accent" href={`mailto:${m.contact}`}>{m.contact}</a>
                </p>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-xl mb-4">{t("ministriesPage.smallGroups.title")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-2 pr-4">{t("ministriesPage.smallGroups.table.name")}</th>
                    <th className="text-left py-2 pr-4">{t("ministriesPage.smallGroups.table.days")}</th>
                    <th className="text-left py-2 pr-4">{t("ministriesPage.smallGroups.table.time")}</th>
                    <th className="text-left py-2">{t("ministriesPage.smallGroups.table.venue")}</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/90">
                  {scfRows.map((r, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="py-2 pr-4">{r.name}</td>
                      <td className="py-2 pr-4">{r.day}</td>
                      <td className="py-2 pr-4">{r.time}</td>
                      <td className="py-2">{r.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <Footer />
      </ComingSoonOverlay>
    </div>
  );
}