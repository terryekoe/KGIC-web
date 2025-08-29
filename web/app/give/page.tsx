"use client";

import Link from "next/link";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";

export default function GivePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            {t("common.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{t("give.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("give.intro")}</p>
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-xl">{t("give.ways")}</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">{t("give.momo")}:</span> 054 198 4208 (KGIC)
            </li>
            <li>
              <span className="font-medium text-foreground">{t("give.bankTransfer")}:</span> {t("give.bankTransferDetail")} <Link href="mailto:info@kgic.org" className="text-accent">info@kgic.org</Link>
            </li>
            <li>
              <span className="font-medium text-foreground">{t("give.inPerson")}:</span> {t("give.inPersonDetail")}
            </li>
          </ul>

          <div className="mt-6">
            <a
              href="#online-giving"
              className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-5 py-2.5 hover:bg-accent/90 transition-colors"
            >
              {t("give.onlineButton")}
            </a>
          </div>
        </section>

        <section id="online-giving" className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-2">{t("give.onlineTitle")}</h3>
          <p className="text-muted-foreground">{t("give.onlineDesc")}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}