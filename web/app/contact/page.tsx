import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">We'd love to hear from you</p>
        </div>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground text-sm inline-flex items-center gap-2">
              <Mail className="w-4 h-4" />
              hello@kgic.church
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground text-sm inline-flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1 (555) 123-4567
            </p>
          </div>
        </section>

        <section className="mt-8">
          <form className="rounded-xl border border-border bg-card p-6 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Full name" className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
              <input placeholder="Email" type="email" className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <textarea placeholder="Message" rows={5} className="bg-transparent border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="submit" className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 hover:opacity-90">
              Send Message
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}