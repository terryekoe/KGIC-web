import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 items-start">
          {/* Branding */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              {/* Smaller logo on mobile for better fit */}
              <Image src="/logo.png" alt="KGIC logo" width={96} height={96} className="shrink-0 w-14 h-14 sm:w-20 sm:h-20" sizes="(min-width: 640px) 80px, 56px" />
              <div>
                <p className="text-sm text-muted-foreground">The King's Generals International Church (KGIC)</p>
                <p className="text-sm text-muted-foreground">responsible kingdom labourers</p>
              </div>
            </div>
            
            {/* Location & Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                <p>Restoration Center, Madina Estate, Accra, Ghana</p>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                Phone: <Link href="tel:0541984208" className="text-accent font-semibold hover:underline">054 198 4208</Link>
              </p>
            </div>
          </div>

          {/* Worship & Services */}
          <div>
            <h4 className="font-semibold mb-3 text-accent">Worship</h4>
            <nav aria-label="Worship Navigation">
              <ul className="space-y-2 text-sm">
                <li><Link href="/live" className="text-muted-foreground hover:text-accent transition-colors">Live Stream</Link></li>
                <li><Link href="/podcasts" className="text-muted-foreground hover:text-accent transition-colors">Podcasts</Link></li>
                <li><Link href="/prayers" className="text-muted-foreground hover:text-accent transition-colors">Prayers</Link></li>
                <li><Link href="/events" className="text-muted-foreground hover:text-accent transition-colors">Events</Link></li>
              </ul>
            </nav>
            
            {/* Service Times */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <h5 className="text-xs font-medium text-foreground mb-2">Service Times</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><span className="font-medium">Sunday:</span> 8:30 AM</li>
                <li><span className="font-medium">Thursday:</span> 6:00 PM</li>
                <li><span className="font-medium">Daily:</span> 5:00 AM</li>
              </ul>
            </div>
          </div>

          {/* Community & Connect */}
          <div>
            <h4 className="font-semibold mb-3 text-accent">Community</h4>
            <nav aria-label="Community Navigation">
              <ul className="space-y-2 text-sm">
                <li><Link href="/discover" className="text-muted-foreground hover:text-accent transition-colors">Discover</Link></li>
                <li><Link href="/ministries" className="text-muted-foreground hover:text-accent transition-colors">Ministries</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
                <li><Link href="/give" className="text-muted-foreground hover:text-accent transition-colors">Give</Link></li>
              </ul>
            </nav>
          </div>

          {/* Resources & More */}
          <div>
            <h4 className="font-semibold mb-3 text-accent">Resources</h4>
            <nav aria-label="Resources Navigation">
              <ul className="space-y-2 text-sm">
                <li><Link href="/book-store" className="text-muted-foreground hover:text-accent transition-colors">Book Store</Link></li>
                <li><Link href="/admin" className="text-muted-foreground hover:text-accent transition-colors">Admin</Link></li>
                <li><Link href="/auth/login" className="text-muted-foreground hover:text-accent transition-colors">Login</Link></li>
              </ul>
            </nav>
            
            {/* Quick Links */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <h5 className="text-xs font-medium text-foreground mb-2">Quick Links</h5>
              <ul className="space-y-1 text-xs">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 border-t border-border pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 text-xs text-muted-foreground">
          <p>© {year} The King's Generals International Church. All rights reserved.</p>
          <p className="text-center sm:text-right">Built with ❤️ for the Kingdom</p>
        </div>
      </div>
    </footer>
  );
}