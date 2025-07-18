import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdul Shakoor Ansari - Senior Technical Lead",
  description: "Experienced Software Engineer and Technical Lead specializing in microservices, cloud technologies, and team leadership across UAE and India markets.",
  keywords: [
    "Software Engineer",
    "Technical Lead",
    "Microservices",
    "Cloud Computing",
    "Dubai",
    "UAE",
    "Node.js",
    "Go Lang",
    "React",
    "Next.js"
  ],
  authors: [{ name: "Abdul Shakoor Ansari" }],
  openGraph: {
    title: "Abdul Shakoor Ansari - Senior Technical Lead",
    description: "Experienced Software Engineer and Technical Lead based in Dubai, UAE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
