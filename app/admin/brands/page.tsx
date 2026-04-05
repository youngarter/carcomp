"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash,
    Globe,
    ExternalLink,
    ChevronRight,
    Car
} from "lucide-react";
import { deleteBrand } from "@/lib/actions/brand.actions";
import BrandModal from "@/components/admin/brands/BrandModal";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandsAdminPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any>(null);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/brands");
            const data = await res.json();
            setBrands(data);
        } catch (err) {
            console.error("Failed to load brands:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Supprimer la marque ${name} ? Cela supprimera aussi tous les modèles associés.`)) return;

        const res = await deleteBrand(id);
        if (res.success) {
            loadBrands();
        } else {
            alert(res.error);
        }
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.origin?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 md:p-12 min-h-screen bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            <Car className="w-4 h-4" />
                            <span>Gestion Catalogue</span>
                        </div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Marques Automobiles</h1>
                        <p className="text-zinc-500 font-medium italic mt-2">Gérez les constructeurs et leurs identités visuelles.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher une marque..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white border border-black/5 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingBrand(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Ajouter</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse border border-zinc-100" />
                        ))}
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-zinc-200">
                        <p className="text-zinc-400 font-black uppercase tracking-widest">Aucune marque trouvée</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredBrands.map((brand) => (
                                <motion.div
                                    key={brand.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative bg-white rounded-[40px] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
                                >
                                    {/* Banner Image */}
                                    <div className="h-32 w-full bg-zinc-100 relative overflow-hidden">
                                        {brand.image ? (
                                            <img src={brand.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                                                <Car className="w-8 h-8 text-zinc-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    </div>

                                    {/* Logo Overlay */}
                                    <div className="absolute top-20 left-8">
                                        <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-3 border-4 border-white overflow-hidden">
                                            {brand.logo ? (
                                                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-2xl font-black text-zinc-200">{brand.name[0]}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-12 p-8">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-zinc-900 leading-none">{brand.name}</h3>
                                                <div className="flex items-center gap-2 mt-2 text-zinc-400">
                                                    <Globe className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{brand.origin || "Origine inconnue"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-zinc-500 text-xs font-medium line-clamp-2 mb-6 italic">
                                            "{brand.description}"
                                        </p>

                                        <div className="flex items-center gap-2 pt-6 border-t border-zinc-50">
                                            <button
                                                onClick={() => {
                                                    setEditingBrand(brand);
                                                    setModalOpen(true);
                                                }}
                                                className="flex-1 py-3 bg-zinc-50 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Pencil className="w-3 h-3 text-emerald-500" /> Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand.id, brand.name)}
                                                className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <BrandModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingBrand(null);
                }}
                onSuccess={() => loadBrands()}
                initialData={editingBrand}
            />
        </div>
    );
}
