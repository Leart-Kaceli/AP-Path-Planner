import type { Metadata } from "next";
import FirebasePerformanceInitializer from "@/components/firebase/FirebasePerformanceInitializer";

import ThemeInitializer from "@/components/theme/ThemeInitializer";

import "./globals.css";

export const metadata: Metadata = {
  title: "AP Path Planner",
  description:
    "Plan AP courses, assignments, and study sessions.",
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
      </body>
    </html>
  );
}