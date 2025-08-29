"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/ui/i18n-provider";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLanguage } = useI18n();
  // remove exhortation state
  // const [currentExhortation, setCurrentExhortation] = React.useState(0);
  // const [currentLanguage, setCurrentLanguage] = React.useState("en");

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

  const socials: { name: "facebook" | "instagram" | "youtube" | "x" | "whatsapp" | "tiktok"; href: string; label: string }[] = [
    { name: "facebook", href: "https://facebook.com/", label: "Facebook" },
    { name: "instagram", href: "https://instagram.com/", label: "Instagram" },
    { name: "youtube", href: "https://youtube.com/", label: "YouTube" },
    { name: "x", href: "https://x.com/", label: "X (Twitter)" },
    { name: "whatsapp", href: "https://wa.me/", label: "WhatsApp" },
    { name: "tiktok", href: "https://tiktok.com/", label: "TikTok" },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const [openLang, setOpenLang] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: Event) => {
      if (!dropdownRef.current) return;
      const target = e.target as Node | null;
      if (!target) return;
      // ignore clicks on the toggle button itself to avoid immediate close
      if (buttonRef.current && buttonRef.current.contains(target)) return;
      if (!dropdownRef.current.contains(target)) setOpenLang(false);
    };
    document.addEventListener("pointerdown", onDoc as any, { capture: true });
    return () => document.removeEventListener("pointerdown", onDoc as any, { capture: true } as any);
  }, []);

  const SocialIcon = ({ name }: { name: "facebook" | "instagram" | "youtube" | "x" | "whatsapp" | "tiktok" }) => {
    const getIconColor = () => {
      switch (name) {
        case "facebook": return "hover:text-[#1877F2]";
        case "instagram": return "hover:text-[#E4405F]";
        case "youtube": return "hover:text-[#FF0000]";
        case "x": return "hover:text-[#000000] dark:hover:text-[#FFFFFF]";
        case "whatsapp": return "hover:text-[#25D366]";
        case "tiktok": return "hover:text-[#000000] dark:hover:text-[#FFFFFF]";
        default: return "hover:text-accent";
      }
    };

    switch (name) {
      case "youtube":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <rect x="2.5" y="5" width="19" height="14" rx="3" ry="3"/>
            <polygon points="10,9 16,12 10,15" fill="currentColor"/>
          </svg>
        );
      case "instagram":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <rect x="3" y="3" width="18" height="18" rx="5"/>
            <circle cx="12" cy="12" r="3.5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
        );
      case "facebook":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M13 8h2.5M13 8v3h2.2M13 11H11v7"/>
          </svg>
        );
      case "x":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <path d="M4 4l16 16M20 4L4 20"/>
          </svg>
        );
      case "whatsapp":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <circle cx="12" cy="17" r="1"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={getIconColor()}>
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
          </svg>
        );
    }
  };

  return (
    <>
      {/* Top Social Bar */}
      <div className="relative z-[60] w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border text-foreground/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-1.5 grid grid-cols-1 lg:grid-cols-3 items-center gap-2">
          {/* Left: Social Icons */}
          <div className="flex items-center justify-center lg:justify-start gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>

          {/* Center: (exhortation removed as requested) */}
          <div className="hidden lg:flex items-center justify-center text-center" />

          {/* Right: Language Dropdown */}
          <div className="relative flex items-center justify-center lg:justify-end gap-1" ref={dropdownRef}>
            <button
              ref={buttonRef}
              onClick={() => setOpenLang((v) => !v)}
              className="px-2 py-1 rounded text-xs font-medium transition-colors border border-border bg-foreground/5 hover:bg-foreground/10 inline-flex items-center gap-2"
              aria-haspopup="listbox"
              aria-expanded={openLang}
            >
              <span className="text-sm">{languages.find(l => l.code === lang)?.flag}</span>
              <span className="font-semibold">{lang.toUpperCase()}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {openLang && (
              <div className="absolute top-full right-0 mt-2 z-[70] min-w-[160px] rounded-md border border-border bg-background shadow-lg">
                <ul role="listbox">
                  {languages.map((l) => (
                    <li key={l.code}>
                      <button
                        role="option"
                        aria-selected={lang === l.code}
                        onClick={() => { setLanguage(l.code as any); setOpenLang(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent/10 ${lang === l.code ? "text-accent font-semibold" : ""}`}
                      >
                        <span className="mr-2">{l.flag}</span>
                        {l.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className={`w-full sticky top-0 z-50 transition-colors ${
        scrolled ? 'border-b border-border bg-background/70 backdrop-blur' : 'bg-transparent border-b-0'
      } ${className}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-3 grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        {/* Mobile: Hamburger */}
        <div className="lg:hidden">
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
        <div className="hidden lg:block"></div>

        {/* Centered navigation group (desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Left Nav */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className={isActive("/") ? "text-accent" : "hover:text-accent"}>
              {t("nav.home")}
            </Link>
            <Link href="/live" className={isActive("/live") ? "text-accent" : "hover:text-accent"}>
              {t("nav.live")}
            </Link>
            <Link href="/discover" className={isActive("/discover") ? "text-accent" : "hover:text-accent"}>
              {t("nav.discover")}
            </Link>
            <Link href="/prayers" className={isActive("/prayers") ? "text-accent" : "hover:text-accent"}>
              {t("nav.prayers")}
            </Link>
            <Link href="/podcasts" prefetch={false} className={isActive("/podcasts") ? "text-accent" : "hover:text-accent"}>
              {t("nav.podcasts")}
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
              {t("nav.events")}
            </Link>
            <Link href="/ministries" className={isActive("/ministries") ? "text-accent" : "hover:text-accent"}>
              {t("nav.ministries")}
            </Link>
            <Link href="/book-store" className={isActive("/book-store") ? "text-accent" : "hover:text-accent"}>
              {t("nav.bookStore")}
            </Link>
            <Link href="/about" className={isActive("/about") ? "text-accent" : "hover:text-accent"}>
              {t("nav.about")}
            </Link>
            <Link href="/contact" className={isActive("/contact") ? "text-accent" : "hover:text-accent"}>
              {t("nav.contact")}
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
        <div className="hidden lg:flex justify-end">
          <Link 
            href="/give" 
            className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-4 py-2 hover:bg-accent/90 transition-colors text-sm"
          >
            {t("nav.give")}
          </Link>
        </div>

        {/* Mobile: Center Logo */}
        <Link href="/" className="justify-self-center lg:hidden">
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
        <div className="lg:hidden">
          <Link 
            href="/give" 
            className="inline-flex items-center rounded-full bg-accent text-accent-foreground font-semibold px-3 py-1.5 hover:bg-accent/90 transition-colors text-xs"
          >
            {t("nav.give")}
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
              <Link href="/" onClick={() => setMenuOpen(false)} className={isActive("/") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.home")}</Link>
              <Link href="/live" onClick={() => setMenuOpen(false)} className={isActive("/live") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.live")}</Link>
              <Link href="/discover" onClick={() => setMenuOpen(false)} className={isActive("/discover") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.discover")}</Link>
              <Link href="/prayers" onClick={() => setMenuOpen(false)} className={isActive("/prayers") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.prayers")}</Link>
              <Link href="/podcasts" onClick={() => setMenuOpen(false)} className={isActive("/podcasts") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.podcasts")}</Link>
              <Link href="/events" onClick={() => setMenuOpen(false)} className={isActive("/events") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.events")}</Link>
              <Link href="/ministries" onClick={() => setMenuOpen(false)} className={isActive("/ministries") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.ministries")}</Link>
              <Link href="/book-store" onClick={() => setMenuOpen(false)} className={isActive("/book-store") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.bookStore")}</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className={isActive("/about") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.about")}</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={isActive("/contact") ? "text-accent" : "text-foreground/90 hover:text-accent"}>{t("nav.contact")}</Link>
              <div className="flex gap-2 pt-4">
                {languages.map((l) => (
                  <button key={l.code} onClick={() => { setLanguage(l.code as any); setMenuOpen(false); }} className={`px-2 py-1 rounded text-xs ${lang===l.code?"bg-accent text-accent-foreground":"hover:bg-foreground/10"}`}>
                    <span className="mr-1">{l.flag}</span>{l.code.toUpperCase()}
                  </button>
                ))}
              </div>
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
    </>
  );
}