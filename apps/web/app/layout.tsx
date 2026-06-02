import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { WhatsNewModal } from "../components/WhatsNewModal";
import SWRegistration from "../components/SWRegistration";
import PWAInstallPrompt from "../components/PWAInstallPrompt";



export const metadata: Metadata = {
  title: "BeekTools",
  description: "Manage your apiaries with native support for both Top Bar and Langstroth Hives, track inspections, and schedule perfect inspections using weather forecasting.",
  openGraph: {
    title: "BeekTools - Smarter Beekeeping",
    description: "Manage your apiaries with native support for both Top Bar and Langstroth Hives, track inspections, and schedule perfect inspections using weather forecasting.",
    url: "https://beektools.com",
    siteName: "BeekTools",
    images: [
      {
        url: "https://beektools.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeekTools - Smarter Beekeeping Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeekTools - Smarter Beekeeping",
    description: "Manage your apiaries with native support for both Top Bar and Langstroth Hives, track inspections, and schedule perfect inspections using weather forecasting.",
    images: ["https://beektools.com/og-image.png"],
  },
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
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* CRASH SILENCER: Neutralizes the buggy session-update bridge that kills the native app during navigation */}
        <Script id="crash-silencer" strategy="beforeInteractive">{`
          (function() {
            if (typeof window !== 'undefined') {
              const hookPostMessage = function() {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage && !window.ReactNativeWebView._isSilenced) {
                  const originalPostMessage = window.ReactNativeWebView.postMessage;
                  window.ReactNativeWebView.postMessage = function(msg) {
                    try {
                      const data = JSON.parse(msg);
                      if (data.type === 'SUPABASE_SESSION_UPDATE') return; 
                    } catch(e) {}
                    return originalPostMessage.apply(window.ReactNativeWebView, [msg]);
                  };
                  window.ReactNativeWebView._isSilenced = true;
                }
              };
              hookPostMessage();
              // Re-hook every 100ms for a few seconds to catch the bridge injection
              let attempts = 0;
              const interval = setInterval(() => {
                hookPostMessage();
                if (++attempts > 50) clearInterval(interval);
              }, 100);
            }
          })();
        `}</Script>
        {/* Global error handler — catch WebView crashes and show the error instead of silently dying */}
        <Script id="global-error-handler" strategy="beforeInteractive">{`
          window.onerror = function(msg, url, line, col, error) {
            if (window.ReactNativeWebView) {
              alert('App Error: ' + msg + '\\nAt: ' + url + ':' + line);
            }
            return false;
          };
          window.addEventListener('unhandledrejection', function(e) {
            if (window.ReactNativeWebView) {
              alert('Async Error: ' + (e.reason ? (e.reason.message || e.reason) : 'Unknown'));
            }
          });
        `}</Script>
        {/* Capture beforeinstallprompt before React hydrates — beforeInteractive runs before any page JS */}
        <Script id="pwa-early-capture" strategy="beforeInteractive">{`
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window._deferredPWAPrompt = e;
          });
        `}</Script>
        <PWAInstallPrompt />
        <AuthProvider>
          {children}
        </AuthProvider>
        <SWRegistration />
        <WhatsNewModal />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-9JW6ZWQSE3"} />
      </body>
    </html>
  );
}
