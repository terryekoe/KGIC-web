import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-8 items-start">
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="KGIC logo" width={112} height={112} className="shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">King's Glory International Church</p>
              <p className="text-sm text-muted-foreground">Building a Glorious Church. Ephesians 5 vs 25 - 27</p>
            </div>
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm">
              <span>&copy; 2024 The King's Generals International Church. All rights reserved.</span>
              <span>Building a worldwide family of responsible kingdom labourers.</span>
              <div className="flex space-x-6">
                <Link 
                  href="/privacy" 
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Services */}
        <div>
          <h4 className="font-semibold mb-2">Location & Services</h4>
          <p className="text-sm text-muted-foreground">Restoration Center, Madina Estate, Accra, Ghana</p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Sunday — Impact Service:</span> 8:30 am – 11:30 am</li>
            <li><span className="font-medium text-foreground">Mon–Sat — Morning Fire Devotion (D.R.E.A.M):</span> 5:00 am – 5:50 am</li>
            <li><span className="font-medium text-foreground">Thursday — Communion Service:</span> 6:00 pm – 8:30 pm</li>
          </ul>
        </div>

        {/* Contact & Links */}
        <div>
          <h4 className="font-semibold mb-2">Contact & Links</h4>
          <p className="text-sm text-muted-foreground">
            Phone: <Link href="tel:0541984208" className="text-accent font-semibold">054 198 4208</Link>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent">About</Link></li>
            <li><Link href="/events" className="hover:text-accent">Events</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}