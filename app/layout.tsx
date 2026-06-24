import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const sabon = localFont({
  src: [
    { path: "./fonts/Sabon.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SabonItalic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/SabonBold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/SabonBoldItalic.ttf", weight: "700", style: "italic" }
  ],
  variable: "--font-sabon"
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans"
});

export const metadata: Metadata = {
  title: "Richemont Learning Recommendations",
  description: "Internal learning recommendation platform for Richemont employees."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sabon.variable} ${openSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
