"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/ui/i18n-provider";

export default function ContactPage() {
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t("contactPage.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("contactPage.subtitle")}</p>
        </div>

        <section className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">{t("contactPage.email")}</h3>
            <p className="text-muted-foreground text-sm inline-flex items-center gap-2">
              <Mail className="w-4 h-4" />
              hello@kgic.church
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">{t("contactPage.phone")}</h3>
            <p className="text-muted-foreground text-sm inline-flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1 (555) 123-4567
            </p>
          </div>
        </section>

        <section className="mt-8">
          <form className="rounded-xl border border-border bg-card p-6 grid gap-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
              <input placeholder={t("contactPage.form.fullName")} className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
              <input placeholder={t("contactPage.form.email")} type="email" className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <textarea placeholder={t("contactPage.form.message")} rows={5} className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="submit" className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 hover:opacity-90">
              {t("contactPage.form.send")}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}