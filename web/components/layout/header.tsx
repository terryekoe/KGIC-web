"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";
import { createPortal } from "react-dom";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open
  React.useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`w-full sticky top-0 z-50 transition-colors ${
      scrolled ? 'border-b border-border bg-background/70 backdrop-blur' : 'bg-transparent border-b-0'
    } ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-3 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        {/* Mobile: Hamburger */}
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md border border-border bg-foreground/5 text-foreground/90 hover:bg-foreground/10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Spacer for centering on desktop */}
        <div className="hidden md:block"></div>

        {/* Centered navigation group (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Left Nav */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className={isActive("/") ? "text-accent" : "hover:text-accent"}>
              Home
            </Link>
            <Link href="/discover" className={isActive("/discover") ? "text-accent" : "hover:text-accent"}>
              Discover
            </Link>
            <Link href="/prayers" className={isActive("/prayers") ? "text-accent" : "hover:text-accent"}>
              Morning Prayer
            </Link>
            <Link href="/podcasts" className={isActive("/podcasts") ? "text-accent" : "hover:text-accent"}>
              Podcasts
            </Link>
          </nav>

          {/* Center Logo */}
          <Link href="/" className="mx-6">
            <Image
              src="/logo.png"
              alt="KGIC logo"
              width={72}
              height={72}
              className="rounded-sm sm:w-[80px] sm:h-[80px] md:w-[96px] md:h-[96px] w-[72px] h-[72px]"
              sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 72px"
              priority
            />
          </Link>

          {/* Right Nav */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/events" className={isActive("/events") ? "text-accent" : "hover:text-accent"}>
              Events
            </Link>
            <Link href="/about" className={isActive("/about") ? "text-accent" : "hover:text-accent"}>
              About
            </Link>
            <Link href="/contact" className={isActive("/contact") ? "text-accent" : "hover:text-accent"}>
              Contact
            </Link>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-md border border-border bg-foreground/5 text-foreground/90 hover:bg-foreground/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Give Button (desktop) - far right */}
        <div className="hidden md:flex justify-end">
          <Link 
            href="/give" 
            className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-4 py-2 hover:bg-accent/90 transition-colors text-sm"
          >
            Give
          </Link>
        </div>

        {/* Mobile: Center Logo */}
        <Link href="/" className="justify-self-center md:hidden">
          <Image
            src="/logo.png"
            alt="KGIC logo"
            width={56}
            height={56}
            className="rounded-sm w-12 h-12 sm:w-16 sm:h-16"
            sizes="(min-width: 640px) 64px, 48px"
          />
        </Link>

        {/* Mobile Give Button */}
        <div className="md:hidden">
          <Link 
            href="/give" 
            className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-3 py-1.5 hover:bg-accent/90 transition-colors text-xs"
          >
            Give
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay via Portal */}
      {menuOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[60] bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 min-h-full flex flex-col">
            <div className="flex items-center justify-between py-3 sticky top-0 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-sm border-b border-border">
              <span className="text-foreground/80">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-md border border-border bg-foreground/5 text-foreground/90 hover:bg-foreground/10"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="pt-6 pb-10 flex flex-col items-center gap-5 text-lg">
              <Link href="/" onClick={() => setMenuOpen(false)} className={isActive("/") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Home</Link>
              <Link href="/discover" onClick={() => setMenuOpen(false)} className={isActive("/discover") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Discover</Link>
              <Link href="/prayers" onClick={() => setMenuOpen(false)} className={isActive("/prayers") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Morning Prayer</Link>
              <Link href="/podcasts" onClick={() => setMenuOpen(false)} className={isActive("/podcasts") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Podcasts</Link>
              <Link href="/events" onClick={() => setMenuOpen(false)} className={isActive("/events") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Events</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className={isActive("/about") ? "text-accent" : "text-foreground/90 hover:text-accent"}>About</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={isActive("/contact") ? "text-accent" : "text-foreground/90 hover:text-accent"}>Contact</Link>
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-foreground/90 hover:text-accent"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}