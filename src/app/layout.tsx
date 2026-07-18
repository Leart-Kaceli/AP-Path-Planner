import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeInitializer from "@/components/theme/ThemeInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP Path Planner",
  description: "Plan AP courses, organize assignments, create study schedules, and track academic progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html
    lang="en"
    suppressHydrationWarning
  >
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      
    >
      <a
  href="#main-content"
  className="sr-only z-[100] rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
>
  Skip to main content
</a>
      <ThemeInitializer />
      {children}
    </body>
  </html>
);
}
