import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = localFont({
  src: [
    {
      path: "../fonts/ArchivoBlack-Regular.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "CheapTradieWebsites — Professional Websites for NZ Tradies | From $500",
  description:
    "Get a professional website for your trade business in minutes. Built by AI, designed for NZ builders, electricians, plumbers & more. Free preview, $500 to keep.",
  keywords: [
    "tradie website",
    "NZ tradesman website",
    "cheap website builder",
    "construction website",
    "builder website NZ",
    "electrician website NZ",
    "plumber website NZ",
    "trade business website",
  ],
  openGraph: {
    title: "CheapTradieWebsites — Professional Websites for NZ Tradies",
    description:
      "Get a professional website for your trade business in minutes. Free preview, $500 to keep.",
    type: "website",
    locale: "en_NZ",
    siteName: "CheapTradieWebsites",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheapTradieWebsites — Professional Websites for NZ Tradies",
    description:
      "Get a professional website for your trade business in minutes. Free preview, $500 to keep.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" className="scroll-smooth">
      <body className={`${dmSans.variable} ${archivo.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
