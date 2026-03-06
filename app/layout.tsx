import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Components
import Header from "./car/components/Header";
import Footer from "./car/components/Footer";
import CompareBar from "./car/components/CompareBar";
import AuthWrapper from "@/components/auth/AuthWrapper";

const pathPrefix = process.env.NEXT_PUBLIC_BASE_PATH || "";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoAdvisor AI - Votre conseiller automobile au Maroc",
  description: "Trouvez la voiture qui vous ressemble avec notre diagnostic intelligent propulsé par l'IA.",
  metadataBase: new URL("https://autoadvisor.ma"),
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
          <Header />
          {children}
          <CompareBar />
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
