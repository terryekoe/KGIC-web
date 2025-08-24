import Link from "next/link";
import { ArrowLeft, Users, Mail } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MinistriesPage() {
  const ministries = [
    { key: "ayac", name: "AYAC (Youth & Young Adults)", blurb: "Raising a generation of responsible kingdom labourers.", contact: "ayac@kgic.org" },
    { key: "children", name: "Children\u2019s Ministry", blurb: "Building strong foundations in Christ for our kids.", contact: "children@kgic.org" },
    { key: "women", name: "Women\u2019s Fellowship", blurb: "Equipping women to lead and serve.", contact: "women@kgic.org" },
    { key: "men", name: "Men\u2019s Fellowship", blurb: "Developing men after God\u2019s heart.", contact: "men@kgic.org" },
  ];

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Ministries</h1>
          <p className="text-muted-foreground text-lg">Find a ministry to belong to and serve with your gifts.</p>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">Theme of the Year</span>
              <span className="text-foreground/90">GREATER THINGS</span>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">Theme of the Month</span>
              <span className="text-foreground/90">AUGUST 2025: BECAUSE I KNOW WHO I AM, I AM BUILT TO OVERCOME AND WIN</span>
            </div>
          </div>
        </div>

        <section className="grid sm:grid-cols-2 gap-6">
          {ministries.map((m) => (
            <div key={m.key} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="font-semibold text-xl">{m.name}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{m.blurb}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact: <a className="text-accent" href={`mailto:${m.contact}`}>{m.contact}</a>
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-xl mb-4">Strategic Cell Fellowship</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left py-2 pr-4">Name of fellowship</th>
                  <th className="text-left py-2 pr-4">Days of Meeting</th>
                  <th className="text-left py-2 pr-4">Time of meeting</th>
                  <th className="text-left py-2">Venue</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                <tr className="border-t border-border">
                  <td className="py-2 pr-4">Glory</td>
                  <td className="py-2 pr-4">Wednesdays</td>
                  <td className="py-2 pr-4">7–8 pm</td>
                  <td className="py-2">Madina Estate, KGIC</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4">Restoration</td>
                  <td className="py-2 pr-4">Sundays</td>
                  <td className="py-2 pr-4">6–6:30 pm</td>
                  <td className="py-2">Dzorwulu, Sis. Daniella’s residence</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4">Impact Plus</td>
                  <td className="py-2 pr-4">Wednesdays</td>
                  <td className="py-2 pr-4">7:30–8:30 pm</td>
                  <td className="py-2">Athletic Oval, UG</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4">Victory</td>
                  <td className="py-2 pr-4">Sundays</td>
                  <td className="py-2 pr-4">6–7 pm</td>
                  <td className="py-2">Agbogba, Pst Barnabas Residence</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}