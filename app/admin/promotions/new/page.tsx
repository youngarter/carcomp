"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPromotion, searchFinitions } from '@/lib/actions/promotion.actions';
import { Tag, ArrowLeft, Save, Search, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewPromotionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Finition search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFinition, setSelectedFinition] = useState<any | null>(null);

    // Form fields
    const [price, setPrice] = useState<number | "">("");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                searchFinitions(searchQuery).then(res => {
                    setSearchResults(res);
                    setIsSearching(false);
                }).catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectFinition = (finition: any) => {
        setSelectedFinition(finition);
        setPrice(finition.price);
        setSearchQuery("");
        setSearchResults([]);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedFinition) {
            setError("Veuillez sélectionner une finition");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            await createPromotion({
                finitionId: selectedFinition.id,
                price: Number(price),
                promotionalPrice: Number(formData.get('promotionalPrice')),
                startDate: new Date(formData.get('startDate') as string),
                endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
            });
            // Redirect after successful creation
            router.push('/admin/promotions');
        } catch (err: any) {
            setError(err.message || "Failed to create promotion");
            setLoading(false);
        }
    }

    return (
        <div className="p-12 max-w-4xl mx-auto">
            <Link href="/admin/promotions" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Retour aux promotions
            </Link>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Nouvelle Promotion</h1>
                    <p className="text-zinc-500 font-medium">Rechercher une finition pour ajouter une offre.</p>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-zinc-100 p-10 shadow-sm mb-8 relative z-10">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Rechercher une Finition</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par modèle, marque ou finition..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {searchResults.length > 0 && !selectedFinition && (
                        <div className="mt-2 border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-lg absolute w-full left-0 right-0 z-20">
                            {searchResults.map(f => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => handleSelectFinition(f)}
                                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-0 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                                        <img src={f.image || ""} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{f.brandName}</div>
                                        <div className="font-bold text-zinc-900 leading-tight">
                                            {f.carModelName} <span className="text-emerald-600">{f.name}</span>
                                        </div>
                                    </div>
                                    <div className="font-black text-zinc-400">{f.price.toLocaleString('fr-FR')} MAD</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedFinition && (
                    <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-emerald-100 shadow-sm">
                                <img src={selectedFinition.image || ""} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sélectionnée</span>
                                </div>
                                <h3 className="font-black text-xl text-zinc-900 leading-tight">
                                    {selectedFinition.brandName} {selectedFinition.carModelName} <span className="text-emerald-600">{selectedFinition.name}</span>
                                </h3>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedFinition(null)}
                            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            Changer
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className={`bg-white rounded-[40px] border border-zinc-100 p-10 shadow-sm space-y-8 transition-opacity duration-300 ${selectedFinition ? 'opacity-100 relative z-0' : 'opacity-50 pointer-events-none'}`}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Prix Initial (MAD)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            required
                            value={price}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 font-medium cursor-not-allowed"
                            title="Le prix initial provient de la finition"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest text-emerald-600">Prix Promotionnel (MAD)</label>
                        <input name="promotionalPrice" type="number" step="0.01" required placeholder="Ex: 320000" className="w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-emerald-800" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Date de Début</label>
                        <input name="startDate" type="date" required className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-zinc-600" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Date de Fin (Optionnel)</label>
                        <input name="endDate" type="date" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-zinc-600" />
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                    <button type="submit" disabled={!selectedFinition || loading} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="w-5 h-5" />
                        {loading ? 'Création...' : 'Créer la Promotion'}
                    </button>
                </div>
            </form>
        </div>
    );
}
