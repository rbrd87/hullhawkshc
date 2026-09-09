import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hullhawkshc.co.uk"),

  title: {
    default: "Hull Hawks HC | Women's Hockey Club in Hull",
    template: "%s | Hull Hawks HC",
  },

  description:
    "Hull Hawks HC is a women's hockey club based in Hull. View our latest fixtures, results, league table and find out how to join or support the Hawks.",

  keywords: [
    "Hull Hawks",
    "Hull Hawks HC",
    "Hull hockey",
    "women's hockey Hull",
    "hockey club Hull",
    "field hockey Hull",
    "women's field hockey",
    "Yorkshire hockey",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Hull Hawks HC | Women's Hockey in Hull",
    description:
      "Fixtures, results, league standings and the latest from Hull Hawks Hockey Club.",
    url: "https://www.hullhawkshc.co.uk",
    siteName: "Hull Hawks HC",
    images: [
      {
        url: "/images/hull-hawks-social.jpg",
        width: 1200,
        height: 630,
        alt: "Hull Hawks Hockey Club",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Hull Hawks HC | Women's Hockey in Hull",
    description:
      "Fixtures, results, league standings and the latest from Hull Hawks Hockey Club.",
    images: ["/images/hull-hawks-social.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
