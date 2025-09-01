import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cookies } from "next/headers";
import { I18nProvider, type LanguageCode } from "@/components/ui/i18n-provider";
import { AudioProvider } from "@/components/ui/audio-provider";
import { PlayBarWrapper } from "@/components/ui/play-bar-wrapper";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The King's Generals International Church (KGIC)",
  description: "responsible kingdom labourers - Experience God's word through inspiring messages, prayers, and community",
  keywords: "church, christian, faith, prayers, podcasts, sermons, community, worship, bible study",
  authors: [{ name: "KGIC" }],
  creator: "The King's Generals International Church",
  publisher: "KGIC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thekingsgenerals.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'es-ES': '/es',
    },
  },
  openGraph: {
    title: "The King's Generals International Church",
    description: "responsible kingdom labourers - Experience God's word through inspiring messages, prayers, and community",
    url: 'https://thekingsgenerals.com',
    siteName: "The King's Generals International Church",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The King's Generals International Church",
    description: "responsible kingdom labourers - Experience God's word through inspiring messages, prayers, and community",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value || "en";
  const lower = String(raw).toLowerCase();
  const allowed: LanguageCode[] = ["en", "fr", "es"];
  const initialLang: LanguageCode = (allowed as string[]).includes(lower) ? (lower as LanguageCode) : "en";

  return (
    <html lang={initialLang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Roboto Mono via Google Fonts to avoid next/font Turbopack issue */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://thekingsgenerals.com" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {/* Theme Provider */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div suppressHydrationWarning>
          <I18nProvider initialLanguage={initialLang}>
            <ThemeProvider>
              <AudioProvider>
                {children}
                <PlayBarWrapper />
                <PerformanceMonitor />
              </AudioProvider>
            </ThemeProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  );
}
