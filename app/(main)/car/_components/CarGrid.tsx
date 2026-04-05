"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import VehicleCard from "@/components/shared/VehicleCard";
import { FinitionCard } from "@/types/car.types";
import { getFilteredCars } from "@/lib/actions/car.actions";
import { useStore } from "@/store/useStore";
import { LayoutGrid, Search } from "lucide-react";

interface CarGridProps {
    initialCars: FinitionCard[];
    filters: any;
    onFilterChange: (key: string, value: string) => void;
}

export default function CarGrid({ initialCars, filters, onFilterChange }: CarGridProps) {
    const { addTrimToCompare, comparingTrims } = useStore();
    const [cars, setCars] = useState<FinitionCard[]>(initialCars);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialCars.length === 12);
    const [skip, setSkip] = useState(0);
    const take = 12;

    const observer = useRef<IntersectionObserver | null>(null);
    const lastCarElementRef = useCallback((node: any) => {
        if (loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingMore) {
                setSkip(prev => prev + take);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore, loadingMore]);

    // Update cars when filters change (reset skip)
    useEffect(() => {
        setCars(initialCars);
        setHasMore(initialCars.length === take);
        setSkip(0);
    }, [initialCars]);

    useEffect(() => {
        if (skip === 0) return;
        async function loadMore() {
            setLoadingMore(true);
            const moreCars = await getFilteredCars(filters, skip, take);
            setCars(prev => {
                const existingIds = new Set(prev.map(c => c.id));
                const uniqueNewCars = (moreCars as any).filter((c: any) => !existingIds.has(c.id));
                return [...prev, ...uniqueNewCars];
            });
            setHasMore(moreCars.length === take);
            setLoadingMore(false);
        }
        loadMore();
    }, [skip, filters]);

    return (
        <div className="flex-1">
            {/* Sort & Stats Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-zinc-100 mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="font-bold text-zinc-500">
                        <span className="text-zinc-900 text-xl font-black mr-2">{cars.length}</span> Véhicules trouvés
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trier par:</span>
                    <select
                        value={filters.sort || "newest"}
                        onChange={(e) => onFilterChange("sort", e.target.value)}
                        className="h-12 bg-white border border-zinc-200 rounded-xl px-4 font-bold text-sm outline-none focus:border-emerald-500"
                    >
                        <option value="newest">Nouveautés</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="ai_score">Score IA</option>
                        <option value="promotions">Promotions</option>
                    </select>
                </div>
            </div>

            {cars.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {cars.map((car, index) => (
                            <div
                                key={car.id}
                                ref={index === cars.length - 1 ? lastCarElementRef : null}
                            >
                                <VehicleCard
                                    trim={car as any}
                                    onCompare={addTrimToCompare}
                                    isComparing={!!comparingTrims.find(ct => ct.id === car.id)}
                                />
                            </div>
                        ))}
                    </div>

                    {loadingMore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-zinc-50 rounded-[2.5rem] aspect-[1/1.2] animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!hasMore && cars.length > 0 && (
                        <div className="mt-20 py-10 text-center">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Vous avez atteint la fin du catalogue</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-40 flex flex-col items-center justify-center bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-100 text-center px-10">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">Aucun véhicule ne correspond</h3>
                    <p className="text-zinc-500 font-medium max-w-sm">
                        Essayez d'ajuster vos filtres ou de réinitialiser votre recherche pour voir plus d'options.
                    </p>
                    <button
                        onClick={() => onFilterChange("reset", "all")}
                        className="mt-8 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all"
                    >
                        Réinitialiser tout
                    </button>
                </div>
            )}
        </div>
    );
}
