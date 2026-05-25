import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ResumeModalProvider } from "@/components/ResumeModalProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aamirshamsi.dev"),
  title: {
    default: "Aamir Ahmed Shamsi — Business Automation & AI Specialist",
    template: "%s | Aamir Ahmed Shamsi",
  },
  description:
    "Aamir Ahmed Shamsi is an entrepreneur and IT professional with 20+ years in business and sales, now building AI-powered automation and full-stack solutions. Based in Karachi, Pakistan.",
  keywords: [
    "Aamir Ahmed Shamsi",
    "business automation",
    "AI specialist",
    "full stack developer",
    "IT professional",
    "React developer",
    "AI integration",
    "entrepreneur",
    "Karachi",
    "Pakistan",
  ],
  authors: [{ name: "Aamir Ahmed Shamsi", url: "https://aamirshamsi.dev" }],
  creator: "Aamir Ahmed Shamsi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aamirshamsi.dev",
    title: "Aamir Ahmed Shamsi — Business Automation & AI Specialist",
    description: "20+ years in business, now building with AI & full-stack tech. Entrepreneur • Developer • Problem Solver.",
    siteName: "Aamir Ahmed Shamsi Portfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Aamir Ahmed Shamsi Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aamir Ahmed Shamsi — Business Automation & AI Specialist",
    description: "20+ years in business, now building with AI & full-stack tech. Entrepreneur • Developer • Problem Solver.",
    creator: "@reckonfx",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: "" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ResumeModalProvider>
            {children}
          </ResumeModalProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(26,27,30,0.95)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#e2e8f0",
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
