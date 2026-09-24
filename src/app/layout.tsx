import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdul Shakoor Ansari — Systems in Motion",
  description: "Senior Technical Lead and software engineer building dependable systems across backend, frontend, cloud, and delivery. 6+ years across GCC banking, mobility and operations — based in Dubai.",
  keywords: ["Abdul Shakoor Ansari", "Senior Technical Lead", "Software Engineer", "Microservices", "Go", "Kafka", "Next.js", "Dubai", "ENBD", "Systems Observatory"],
  authors: [{ name: "Abdul Shakoor Ansari", url: "https://www.linkedin.com/in/abdul-ansari-a271ba40" }],
  creator: "Abdul Shakoor Ansari",
  metadataBase: new URL("https://abdulshakoor.example.com"),
  openGraph: {
    title: "Abdul Shakoor Ansari — Systems in Motion",
    description: "Senior Technical Lead designing dependable systems across APIs, events, data and delivery.",
    type: "website",
    locale: "en_AE",
    siteName: "Abdul Shakoor Ansari",
  },
  twitter: { card: "summary_large_image", title: "Abdul Shakoor Ansari — Systems in Motion", description: "Dependable systems across backend, frontend, cloud and delivery." },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#f3f1eb",
  colorScheme: "light" as const,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdul Shakoor Ansari",
  jobTitle: "Senior Technical Lead",
  description: "Software engineer building dependable systems across backend, frontend, cloud and delivery.",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  email: "mailto:shakoor.ansari@hotmail.com",
  sameAs: ["https://www.linkedin.com/in/abdul-ansari-a271ba40"],
  knowsAbout: ["Go", "Node.js", "Microservices", "Kafka", "PostgreSQL", "MongoDB", "Redis", "React", "Next.js", "TypeScript", "Docker", "Azure", "AWS", "CI/CD"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</body></html>;
}
