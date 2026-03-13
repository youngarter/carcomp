"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VehicleCard from "./components/VehicleCard";
import { Car } from "../../types/car";
import { getFilteredCars, getBrands } from "./actions";
import { useStore } from "../../store/useStore";
import { Filter, SlidersHorizontal, LayoutGrid, List, Search, ChevronDown, Sparkles } from "lucide-react";
import AISearch from "./components/AISearch";
import PriceRangeSlider from "./components/PriceRangeSlider";

export default function CarsListingPage() {
    const { addTrimToCompare, comparingTrims } = useStore();
    const [cars, setCars] = useState<Car[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const take = 12;

    const [filters, setFilters] = useState({
        brand: "all",
        category: "all",
        priceMin: "",
        priceMax: "",
        energy: "all",
        transmission: "all",
        seats: "all",
        aiScoreMin: "",
        sort: "newest"
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastCarElementRef = useCallback((node: any) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingMore) {
                setSkip(prev => prev + take);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadingMore]);

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            const [brandsData, carsData] = await Promise.all([
                getBrands(),
                getFilteredCars(filters, 0, take)
            ]);
            setBrands(brandsData);
            setCars(carsData as any);
            setHasMore(carsData.length === take);
            setLoading(false);
            setSkip(0);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        fetchInitialData();
    }, [filters]);

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

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-zinc-900 font-sans">
            <main className="pb-32">



                <div className="max-w-[1600px] mx-auto mt-8 px-6 sm:px-10 lg:px-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Filters Sidebar */}
                        <aside className="w-full lg:w-80 shrink-0">
                            <div className="sticky top-32 space-y-8 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-black text-zinc-900 flex items-center gap-3">
                                        <Filter className="w-5 h-5 text-emerald-500" />
                                        Filtres
                                    </h2>
                                    <button
                                        onClick={() => setFilters({
                                            brand: "all", category: "all", priceMin: "", priceMax: "",
                                            energy: "all", transmission: "all", seats: "all", aiScoreMin: "", sort: "newest"
                                        })}
                                        className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-600"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>

                                {/* Brand Filter */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Marque</label>
                                    <select
                                        value={filters.brand}
                                        onChange={(e) => handleFilterChange("brand", e.target.value)}
                                        className="w-full h-14 bg-zinc-50 rounded-2xl px-6 border border-zinc-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="all">Toutes les marques</option>
                                        {brands.map(b => (
                                            <option key={b.id} value={b.slug}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Catégorie</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["SUV", "Berline", "Citadine", "Compacte", "Coupé", "Électrique"].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => handleFilterChange("category", filters.category === cat ? "all" : cat)}
                                                className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filters.category === cat ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white border-zinc-100 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500"}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Slider */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Budget (DH)</label>
                                    <PriceRangeSlider
                                        min={0}
                                        max={2000000}
                                        step={10000}
                                        initialMin={filters.priceMin ? parseInt(filters.priceMin) : 0}
                                        initialMax={filters.priceMax ? parseInt(filters.priceMax) : 2000000}
                                        onChange={(min: number, max: number) => {
                                            handleFilterChange("priceMin", min.toString());
                                            handleFilterChange("priceMax", max.toString());
                                        }}
                                    />
                                </div>

                                {/* Other Filters */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Énergie</label>
                                    <select
                                        value={filters.energy}
                                        onChange={(e) => handleFilterChange("energy", e.target.value)}
                                        className="w-full h-14 bg-zinc-50 rounded-2xl px-6 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm"
                                    >
                                        <option value="all">Tout</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Essence">Essence</option>
                                        <option value="Hybride">Hybride</option>
                                        <option value="Electrique">Électrique</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Boite</label>
                                    <select
                                        value={filters.transmission}
                                        onChange={(e) => handleFilterChange("transmission", e.target.value)}
                                        className="w-full h-14 bg-zinc-50 rounded-2xl px-6 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm"
                                    >
                                        <option value="all">Tout</option>
                                        <option value="Automatique">Automatique</option>
                                        <option value="Manuelle">Manuelle</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Cars Grid */}
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
                                        value={filters.sort}
                                        onChange={(e) => handleFilterChange("sort", e.target.value)}
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

                            {/* Main Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-zinc-50 rounded-[2.5rem] aspect-[1/1.2] animate-pulse" />
                                    ))}
                                </div>
                            ) : cars.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {cars.map((car, index) => {
                                            if (cars.length === index + 1) {
                                                return (
                                                    <div ref={lastCarElementRef} key={car.id}>
                                                        <VehicleCard
                                                            trim={car}
                                                            onCompare={addTrimToCompare}
                                                            isComparing={!!comparingTrims.find(ct => ct.id === car.id)}
                                                        />
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <VehicleCard
                                                        key={car.id}
                                                        trim={car}
                                                        onCompare={addTrimToCompare}
                                                        isComparing={!!comparingTrims.find(ct => ct.id === car.id)}
                                                    />
                                                );
                                            }
                                        })}
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
                                        onClick={() => setFilters({
                                            brand: "all", category: "all", priceMin: "", priceMax: "",
                                            energy: "all", transmission: "all", seats: "all", aiScoreMin: "", sort: "newest"
                                        })}
                                        className="mt-8 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all"
                                    >
                                        Réinitialiser tout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}
