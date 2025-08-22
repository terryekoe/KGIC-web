import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
  description: "Bold, modern church web app for morning prayers, podcasts, and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {/* Theme Provider */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div suppressHydrationWarning>
          {/* @ts-expect-error Server/Client boundary wrapper */}
          <ThemeProvider>{children}</ThemeProvider>
        </div>
      </body>
    </html>
  );
}
