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
  icons: {
    // SVG for modern browsers; the app/favicon.ico convention supplies the
    // fallback link automatically for older ones.
    icon: { url: "/heart.svg", type: "image/svg+xml" },
  },
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
