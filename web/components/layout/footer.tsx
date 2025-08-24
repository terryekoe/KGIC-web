import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 md:grid-cols-3 items-start">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Smaller logo on mobile for better fit */}
              <Image src="/logo.png" alt="KGIC logo" width={96} height={96} className="shrink-0 w-14 h-14 sm:w-20 sm:h-20" sizes="(min-width: 640px) 80px, 56px" />
              <div>
                <p className="text-sm text-muted-foreground">The King's Generals International Church (KGIC)</p>
                <p className="text-sm text-muted-foreground">responsible kingdom labourers</p>
              </div>
            </div>
            {/* Slogan only, no additional tagline */}

          </div>

          {/* Location & Services */}
          <div>
            <h4 className="font-semibold mb-3">Location & Services</h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4" />
              <p>Restoration Center, Madina Estate, Accra, Ghana</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Sunday — Impact Service:</span>
                <span> 8:30 am – 11:30 am</span>
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Mon–Sat — Morning Fire Devotion (D.R.E.A.M):</span>
                <span> 5:00 am – 5:50 am</span>
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Thursday — Communion Service:</span>
                <span> 6:00 pm – 8:30 pm</span>
              </li>
            </ul>
          </div>

          {/* Contact & Links */}
          <div>
            <h4 className="font-semibold mb-3">Contact & Links</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone: <Link href="tel:0541984208" className="text-accent font-semibold">054 198 4208</Link>
            </p>
            <nav aria-label="Footer Navigation" className="mt-4">
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-accent">About</Link></li>
                <li><Link href="/events" className="hover:text-accent">Events</Link></li>
                <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 border-t border-border pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-muted-foreground">
          <p>© {year} The King's Generals International Church. All rights reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span className="opacity-40">•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}