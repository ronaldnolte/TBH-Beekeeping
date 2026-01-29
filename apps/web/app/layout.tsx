import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import FeedbackButton from "../components/FeedbackButton";
import PWAInstallPrompt from "../components/PWAInstallPrompt";



export const metadata: Metadata = {
  title: "BeekTools",
  description: "Top-bar hive management application",
  appleWebApp: {
    capable: true, // This generates apple-mobile-web-app-capable
    statusBarStyle: "default",
    title: "BeekTools",
  },
  other: {
    "mobile-web-app-capable": "yes", // Fixes deprecated warning
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png?v=2",
    apple: "/apple-icon.png?v=2",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F5A623",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <PWAInstallPrompt />
        <FeedbackButton />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
      </body>
    </html>
  );
}
