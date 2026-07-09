import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  title: "Orenara — Outdoor LED Strip Lighting, Built for Australian Conditions",
  description:
    "IP68-rated outdoor LED strip lighting, properly dimmable, built to survive Queensland humidity and coastal salt air. Made-to-order kits for Australian homes. Enquire for pricing.",
  keywords: [
    "outdoor LED strip lighting",
    "IP68 LED strip",
    "outdoor strip lighting Australia",
    "pergola lighting",
    "pool lighting",
    "pathway lighting",
    "0-10V dimming",
    "RCM compliant",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Orenara — Outdoor LED Strip Lighting, Built for Australian Conditions",
    description:
      "IP68-rated outdoor LED strip lighting, properly dimmable, built to survive Queensland humidity and coastal salt air. Enquire for pricing.",
    siteName: "Orenara",
    images: [
      {
        url: "/assets/generated/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orenara IP68 Outdoor LED Strip Lighting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orenara — Outdoor LED Strip Lighting",
    description:
      "IP68-rated. Properly dimmable. Built for Australian conditions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* Google Ads global site tag — only rendered when the Ads ID env var is set.
            strategy="afterInteractive" defers until after hydration so it never blocks
            the main thread (preferred over @next/third-parties here because we need the
            raw gtag config call to initialise the dataLayer before any conversion fires). */}
        {adsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
