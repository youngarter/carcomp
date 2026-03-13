import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
    title: "Catalogue de Voitures - CarComp Maroc",
    description:
        "Parcourez notre catalogue complet de voitures neuves au Maroc. Comparez les prix, les catégories et les caractéristiques techniques pour trouver votre voiture idéale.",
    openGraph: {
        title: "Catalogue de Voitures - CarComp Maroc",
        description:
            "Découvrez toutes les voitures disponibles au Maroc avec des analyses IA détaillées.",
        type: "website",
    },
};

export default function CarsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFF]">
            <Header />
            <main className="flex-1 pt-24">
                {children}
            </main>
            <Footer />
        </div>
    );
}