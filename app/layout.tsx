import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "./toasterprovider";
import Script from "next/script";
import FacebookPixelRouteListener from "./FacebookPixelRouteListener";
import Image from "next/image";
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
  title: "Infinity Luxe Furnishings",
  description: "High end comfort & factory direct prices for your homes and offices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel base snippet */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '853177857369230'); fbq('track', 'PageView');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* No-JS fallback */}
        <noscript>
          <Image
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=853177857369230&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Suspense fallback={null}>
          <FacebookPixelRouteListener />
        </Suspense>

        <Navbar />
        <ToasterProvider />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
