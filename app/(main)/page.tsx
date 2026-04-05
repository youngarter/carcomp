import Chatbot from "@/app/(main)/car/_components/Chatbot";
import HeroCarousel from "@/app/(home)/_components/HeroCarousel";
import BrandsGrid from "@/app/(home)/_components/BrandsGrid";
import AIComparisons from "@/app/(home)/_components/AIComparisons";
import UserExperiences from "@/app/(home)/_components/UserExperiences";
import FeaturedArticles from "@/app/(home)/_components/FeaturedArticles";
import HomePageClient from "@/app/(home)/_components/HomePageClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Chatbot />

      <main className="flex flex-col">
        <HeroCarousel />

        {/* Interactive client parts (AISearch + PromotionCars) */}
        <HomePageClient />

        <BrandsGrid />
        <AIComparisons />
        <UserExperiences />
        <FeaturedArticles />
      </main>
    </div>
  );
}
