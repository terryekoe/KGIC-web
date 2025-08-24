import Link from "next/link";
import { ArrowLeft, Radio, Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LivePage() {
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Live</h1>
          <p className="text-muted-foreground text-lg">Join our live services and events. When we are live, the stream will appear below.</p>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-xl">Now Playing</h2>
          </div>
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center text-muted-foreground">
            <p>Provide your live embed code or link and we'll place it here.</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Typical live times: Sundays 8:30 am, Thursdays 6:00 pm (update as needed)</span>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-2">Missed it?</h3>
          <p className="text-muted-foreground">Catch up on the latest messages in our <Link href="/podcasts" className="text-accent">Podcasts</Link> or <Link href="/discover" className="text-accent">Discover</Link> pages.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}