import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cookies } from "next/headers";
import { I18nProvider, type LanguageCode } from "@/components/ui/i18n-provider";
import { AudioProvider } from "@/components/ui/audio-provider";
import { PlayBarWrapper } from "@/components/ui/play-bar-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The King's Generals International Church (KGIC)",
  description: "responsible kingdom labourers",
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
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {/* Theme Provider */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div suppressHydrationWarning>
          <I18nProvider initialLanguage={initialLang}>
            <ThemeProvider>
              <AudioProvider>
                {children}
                <PlayBarWrapper />
              </AudioProvider>
            </ThemeProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  );
}
