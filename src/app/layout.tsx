import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://threadly.one"),
  title: {
    default: "threadly.one | Custom Embroidered Accessories",
    template: "%s | threadly.one",
  },
  description:
    "Custom embroidered caps, tees & totes made just for you. Design your own embroidered accessories with our 3D customizer. Tiny details. Big vibe.",
  keywords: [
    "custom embroidery",
    "embroidered caps",
    "embroidered tees",
    "embroidered totes",
    "custom accessories",
    "personalized gifts",
    "threadly",
  ],
  authors: [{ name: "threadly.one" }],
  creator: "threadly.one",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://threadly.one",
    siteName: "threadly.one",
    title: "threadly.one | Custom Embroidered Accessories",
    description:
      "Custom embroidered caps, tees & totes made just for you. Design your own embroidered accessories with our 3D customizer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "threadly.one | Custom Embroidered Accessories",
    description:
      "Custom embroidered caps, tees & totes made just for you. Tiny details. Big vibe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://threadly.one",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-foreground font-sans">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "d607c8105c134eb69d950abecbead6ad"}'
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
