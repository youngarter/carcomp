import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CompareBar from "@/app/(main)/car/_components/CompareBar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
            <CompareBar />
            <Footer />
        </>
    );
}
