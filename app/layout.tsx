import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import UserSync from '@/components/user-sync'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What's Poopin - AI Health Analysis",
  description: "AI-powered health analysis for humans and pets",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "What's Poopin",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// Check if this is a mobile build
const isMobileBuild = process.env.CAPACITOR_BUILD === 'true'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isMobileBuild ? (
          // Mobile build - no Clerk provider
          <div>
            {children}
          </div>
        ) : (
          // Web build - with Clerk provider
          <ClerkProvider>
            <UserSync />
            {children}
          </ClerkProvider>
        )}
      </body>
    </html>
  );
}
