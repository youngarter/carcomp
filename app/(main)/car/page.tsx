import React from "react";
import { getFilteredCars } from "@/lib/actions/car.actions";
import { getBrands } from "@/lib/actions/brand.actions";
import CarListingClient from "./_components/CarListingClient";

export default async function CarsListingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const filters = {
        brand: (params.brand as string) || "all",
        category: (params.category as string) || "all",
        priceMin: (params.priceMin as string) || "",
        priceMax: (params.priceMax as string) || "",
        energy: (params.energy as string) || "all",
        transmission: (params.transmission as string) || "all",
        seats: (params.seats as string) || "all",
        aiScoreMin: (params.aiScoreMin as string) || "",
        sort: (params.sort as string) || "newest"
    };

    const take = 12;
    const [brandsData, carsData] = await Promise.all([
        getBrands(),
        getFilteredCars(filters, 0, take)
    ]);

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-zinc-900 font-sans">
            <main className="pb-32">
                <CarListingClient
                    initialCars={carsData as any}
                    brands={brandsData}
                    initialFilters={filters}
                />
            </main>
        </div>
    );
}
