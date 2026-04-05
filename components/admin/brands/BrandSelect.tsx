"use client";

import React, { useState } from "react";
import { Plus, Check, ChevronDown, Search } from "lucide-react";
import BrandModal from "./BrandModal";

interface BrandSelectProps {
    brands: any[];
    selectedBrandId?: string;
    onSelect: (brand: any) => void;
    onBrandCreated: () => void;
}

export default function BrandSelect({
    brands,
    selectedBrandId,
    onSelect,
    onBrandCreated
}: BrandSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedBrand = brands.find(b => b.id === selectedBrandId);
    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-4 ml-6">
                Marque du véhicule <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-8 py-6 rounded-3xl bg-white border border-black/5 shadow-sm text-left transition-all hover:shadow-xl flex items-center justify-between ${isOpen ? "ring-4 ring-emerald-500/10 border-emerald-500/50" : ""}`}
                >
                    {selectedBrand ? (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-50 overflow-hidden flex items-center justify-center border border-zinc-100">
                                {selectedBrand.logo ? (
                                    <img src={selectedBrand.logo} alt="" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-xs font-black text-zinc-300">{selectedBrand.name[0]}</span>
                                )}
                            </div>
                            <span className="font-black text-xl text-zinc-900">{selectedBrand.name}</span>
                        </div>
                    ) : (
                        <span className="text-zinc-400 font-bold text-lg">Choisir une marque...</span>
                    )}
                    <ChevronDown className={`w-6 h-6 text-zinc-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 z-[60] bg-white rounded-[40px] shadow-2xl border border-black/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                        <div className="p-4 border-b border-zinc-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    autoFocus
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-2">
                            {filteredBrands.length === 0 ? (
                                <p className="p-8 text-center text-zinc-400 font-bold italic text-sm">Aucune marque trouvée.</p>
                            ) : (
                                filteredBrands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        onClick={() => {
                                            onSelect(brand);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full p-4 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-colors group ${selectedBrandId === brand.id ? "bg-emerald-50/50" : ""}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center overflow-hidden">
                                                {brand.logo ? <img src={brand.logo} alt="" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] font-black">{brand.name[0]}</span>}
                                            </div>
                                            <span className={`font-black uppercase tracking-wider text-xs ${selectedBrandId === brand.id ? "text-emerald-600" : "text-zinc-600"}`}>
                                                {brand.name}
                                            </span>
                                        </div>
                                        {selectedBrandId === brand.id && <Check className="w-4 h-4 text-emerald-600" />}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-zinc-900 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setModalOpen(true);
                                }}
                                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                                <Plus className="w-4 h-4" />
                                Créer une Marque
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <BrandModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={(newBrand) => {
                    onBrandCreated();
                    if (newBrand) onSelect(newBrand);
                }}
            />
        </div>
    );
}
