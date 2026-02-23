import type { Metadata } from "next";
import { Manrope, Playfair_Display, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Kahal Beis Tefilla | A Fortress of Torah in Ramat Eshkol, Jerusalem",
  description:
    "Kahal Beis Tefilla - A vibrant Torah community in Ramat Eshkol, Jerusalem under the leadership of Rabbi Dovid Steinhauer. Davening, shiurim, community programs, and chesed.",
  keywords: [
    "Kahal Beis Tefilla",
    "KBT",
    "Khal Bais Tefillah",
    "Ramat Eshkol shul",
    "Jerusalem shul",
    "Rabbi Dovid Steinhauer",
    "kollel Ramat Eshkol",
    "American shul Ramat Eshkol",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.variable} ${playfair.variable} ${frankRuhl.variable} antialiased`}>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
