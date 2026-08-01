import type { Metadata } from "next";
import FirebasePerformanceInitializer from "@/components/firebase/FirebasePerformanceInitializer";

import ThemeInitializer from "@/components/theme/ThemeInitializer";
import WebVitalsReporter from "@/components/monitoring/WebVitalsReporter";

import "./globals.css";

import {
  Analytics,
} from "@vercel/analytics/next";

import {
  SpeedInsights,
} from "@vercel/speed-insights/next";

export const metadata:
  Metadata = {
  metadataBase:
    new URL(
      process.env
        .NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000",
    ),

  title: {
    default:
      "AP Path Planner",

    template:
      "%s | AP Path Planner",
  },

  description:
    "Plan AP courses, assignments, study sessions, grades, and exam goals in one organized dashboard.",

  applicationName:
    "AP Path Planner",

  keywords: [
    "AP courses",
    "study planner",
    "assignment tracker",
    "grade tracker",
    "AP exam planner",
  ],

  creator:
    "AP Path Planner",

  openGraph: {
    type:
      "website",

    title:
      "AP Path Planner",

    description:
      "Organize AP courses, assignments, study sessions, grades, and exam goals.",

    siteName:
      "AP Path Planner",
  },

  twitter: {
    card:
      "summary",

    title:
      "AP Path Planner",

    description:
      "Organize AP courses, assignments, study sessions, grades, and exam goals.",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeInitializer />
          <FirebasePerformanceInitializer />

        {children}
        <WebVitalsReporter />
        <Analytics />
  <SpeedInsights />
      </body>
    </html>
  );
}