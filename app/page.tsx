import Chatbot from "./car/components/Chatbot";
import HeroCarousel from "./car/components/HeroCarousel";
import BrandsGrid from "./car/components/BrandsGrid";
import AIComparisons from "./car/components/AIComparisons";
import UserExperiences from "./car/components/UserExperiences";
import FeaturedArticles from "./car/components/FeaturedArticles";
import HomePageClient from "./car/components/HomePageClient";

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
