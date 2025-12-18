import type { Metadata, Viewport } from "next";
import "./globals.css";

import DatabaseProvider from "../components/DatabaseProvider";

export const metadata: Metadata = {
  title: "TBH Beekeeper",
  description: "Top-bar hive management application",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TBH Beekeeper",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
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

        <DatabaseProvider>
          {children}
        </DatabaseProvider>
      </body>
    </html>
  );
}
