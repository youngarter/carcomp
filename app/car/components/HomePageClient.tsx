"use client";

import { useStore } from "@/store/useStore";
import AISearch from "./AISearch";
import PromotionCars from "./PromotionCars";

/**
 * Client wrapper for the interactive parts of the homepage:
 * - AISearch (uses state via Zustand)
 * - PromotionCars (uses compare functionality)
 *
 * Keeping this isolated makes the rest of app/page.tsx a pure Server Component,
 * improving FCP and SEO.
 */
export default function HomePageClient() {
    const { addTrimToCompare, comparingTrims, searchQuery, setSearchQuery } = useStore();

    return (
        <>
            <AISearch
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={() => {
                    document.getElementById("promotions")?.scrollIntoView({ behavior: "smooth" });
                }}
            />

            <div id="promotions">
                <PromotionCars
                    onCompare={addTrimToCompare}
                    comparingTrims={comparingTrims}
                />
            </div>
        </>
    );
}
