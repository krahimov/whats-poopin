import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoopScore - AI-Powered Health Analysis",
  description: "Analyze your poop health with AI and get personalized dietary recommendations",
  keywords: ["health", "analysis", "AI", "nutrition", "wellness"],
  authors: [{ name: "PoopScore Team" }],
  viewport: "width=device-width, initial-scale=1",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PoopScore",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#3b82f6",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
