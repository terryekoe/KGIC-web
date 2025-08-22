import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About KGIC</h1>
          <p className="text-muted-foreground text-lg max-w-prose">
            The King's Generals International Church is a Christ-centered church committed to birthing God's army of visionaries for worldwide reformation.
          </p>
        </div>

        {/* Vision */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">Our Vision</h2>
            <p className="text-muted-foreground">
              To birth God's army of Visionaries for a worldwide Christ centered reformation.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">Our Mission</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><span className="font-semibold">1.</span> Passionate Teaching and training.</p>
              <p><span className="font-semibold">2.</span> Practical demonstration of the kingdom gospel through lives worldwide by the manifestation of the power and fruit of the holy ghost.</p>
              <p><span className="font-semibold">3.</span> Strategic fellowship.</p>
            </div>
          </div>
        </section>

        {/* Leadership & Location */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-3 text-accent">Leadership</h3>
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground">Lead Pastor</p>
              <p>Apostle Eric Abrahams-Appiah</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-3 text-accent">Location</h3>
            <div className="text-muted-foreground space-y-2">
              <p className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Restoration Center
              </p>
              <p>Madina Estate, Accra, Ghana</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}