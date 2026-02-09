import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bondist = localFont({
  src: "../public/assets/fonts/Bondist.ttf",
  variable: "--font-bondist",
  display: "swap"
});

const stixTwoText = localFont({
  src: [
    {
      path: "../public/assets/fonts/STIXTwoText-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/assets/fonts/STIXTwoText-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-stix-two-text",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Be My Valentine",
  description: "A Valentine site for Rebecca"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bondist.variable} ${stixTwoText.variable}`}>{children}</body>
    </html>
  );
}
