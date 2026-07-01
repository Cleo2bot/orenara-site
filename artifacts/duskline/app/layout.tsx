import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://duskline.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Duskline — Outdoor LED Strip Lighting, Built for Australian Conditions",
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
    url: siteUrl,
    title: "Duskline — Outdoor LED Strip Lighting, Built for Australian Conditions",
    description:
      "IP68-rated outdoor LED strip lighting, properly dimmable, built to survive Queensland humidity and coastal salt air. Enquire for pricing.",
    siteName: "Duskline",
    images: [
      {
        url: "/assets/generated/og-image.png",
        width: 1200,
        height: 630,
        alt: "Duskline IP68 Outdoor LED Strip Lighting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duskline — Outdoor LED Strip Lighting",
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
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
