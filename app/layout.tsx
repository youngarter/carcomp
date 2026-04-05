import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Components
import AuthWrapper from "@/components/auth/AuthWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoAdvisor AI - Votre conseiller automobile au Maroc",
  description: "Trouvez la voiture qui vous ressemble avec notre diagnostic intelligent propulsé par l'IA. Comparez les prix et les caractéristiques techniques au Maroc.",
  metadataBase: new URL("https://autoadvisor.ma"),
  openGraph: {
    title: "AutoAdvisor AI - Votre conseiller automobile au Maroc",
    description: "Le guide ultime pour acheter votre voiture au Maroc. Comparaisons, avis IA et prix à jour.",
    url: "https://autoadvisor.ma",
    siteName: "AutoAdvisor",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AutoAdvisor AI",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoAdvisor AI - Votre conseiller automobile au Maroc",
    description: "Diagnostic automobile intelligent propulsé par l'IA au Maroc.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#F9FAFB] text-[#171717]`}
      >
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
