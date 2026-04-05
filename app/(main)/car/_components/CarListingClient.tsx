"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarFilters from "./CarFilters";
import CarGrid from "./CarGrid";
import { FinitionCard } from "@/types/car.types";

interface CarListingClientProps {
    initialCars: FinitionCard[];
    brands: any[];
    initialFilters: any;
}

export default function CarListingClient({ initialCars, brands, initialFilters }: CarListingClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState(initialFilters);
    const [cars, setCars] = useState(initialCars);

    const handleFilterChange = (key: string, value: string) => {
        if (key === "reset") {
            const resetFilters = {
                brand: "all",
                category: "all",
                priceMin: "",
                priceMax: "",
                energy: "all",
                transmission: "all",
                seats: "all",
                aiScoreMin: "",
                sort: "newest"
            };
            setFilters(resetFilters);
            updateQueryParams(resetFilters);
        } else {
            const newFilters = { ...filters, [key]: value };
            setFilters(newFilters);
            updateQueryParams(newFilters);
        }
    };

    const updateQueryParams = (newFilters: any) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.set(key, value as string);
            }
        });
        router.push(`/car?${params.toString()}`, { scroll: false });
    };

    // Keep state in sync with initial data from server
    useEffect(() => {
        setCars(initialCars);
    }, [initialCars]);

    return (
        <div className="max-w-[1600px] mx-auto mt-8 px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-12">
                <CarFilters
                    brands={brands}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={() => handleFilterChange("reset", "all")}
                />
                <CarGrid
                    initialCars={cars}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </div>
    );
}
