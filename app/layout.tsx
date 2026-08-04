import type { Metadata } from "next";
import { Geist, Stack_Sans_Notch } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  weight: "400",
  subsets: ["latin"],
});

const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yuliia Yaryna — UX Designer & Researcher",
  description: "Portfolio of Yuliia Yaryna, UX/UI designer and researcher.",
  // Favicon comes from the app/icon.svg file convention (the hero mark).
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${stackSansNotch.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
