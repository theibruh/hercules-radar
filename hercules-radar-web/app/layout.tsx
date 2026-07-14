import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hercules Radar: Live Flight Tracking",
  description: "Live flight tracking over global airspace. The way of the future.",
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
      <body className="min-h-full flex flex-col bg-[#0a0f1a]">
        <SplashScreen />
        <Suspense fallback={<div className="h-20" />}>
          <Navbar />
        </Suspense>
        {/* Add padding to the top of the page to account for the fixed navbar */}
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}