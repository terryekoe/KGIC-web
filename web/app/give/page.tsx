import Link from "next/link";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function GivePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Give</h1>
          <p className="text-muted-foreground text-lg">Partner with us to advance the Gospel and serve our community.</p>
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-xl">Ways to Give</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Mobile Money (MOMO):</span> 054 198 4208 (KGIC)
            </li>
            <li>
              <span className="font-medium text-foreground">Bank Transfer:</span> Request bank details at <Link href="mailto:info@kgic.org" className="text-accent">info@kgic.org</Link>
            </li>
            <li>
              <span className="font-medium text-foreground">In-Person:</span> During any of our services
            </li>
          </ul>

          <div className="mt-6">
            <a
              href="#online-giving"
              className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-5 py-2.5 hover:bg-accent/90 transition-colors"
            >
              Give Online
            </a>
          </div>
        </section>

        <section id="online-giving" className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-2">Online Giving</h3>
          <p className="text-muted-foreground">Integrate your preferred payment provider here (Flutterwave, Paystack, Stripe, etc.).</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}