"use client";

import React from "react";
import { Filter } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";

interface CarFiltersProps {
    brands: any[];
    filters: any;
    onFilterChange: (key: string, value: string) => void;
    onReset: () => void;
}

export default function CarFilters({ brands, filters, onFilterChange, onReset }: CarFiltersProps) {
    const categories = ["SUV", "Berline", "Citadine", "Compacte", "Coupé", "Électrique"];

    return (
        <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-8 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-zinc-900 flex items-center gap-3">
                        <Filter className="w-5 h-5 text-emerald-500" />
                        Filtres
                    </h2>
                    <button
                        onClick={onReset}
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
                        onChange={(e) => onFilterChange("brand", e.target.value)}
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
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onFilterChange("category", filters.category === cat ? "all" : cat)}
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
                            onFilterChange("priceMin", min.toString());
                            onFilterChange("priceMax", max.toString());
                        }}
                    />
                </div>

                {/* Other Filters */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Énergie</label>
                    <select
                        value={filters.energy}
                        onChange={(e) => onFilterChange("energy", e.target.value)}
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
                        onChange={(e) => onFilterChange("transmission", e.target.value)}
                        className="w-full h-14 bg-zinc-50 rounded-2xl px-6 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm"
                    >
                        <option value="all">Tout</option>
                        <option value="Automatique">Automatique</option>
                        <option value="Manuelle">Manuelle</option>
                    </select>
                </div>
            </div>
        </aside>
    );
}
