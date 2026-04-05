"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
    Tag,
    Search,
    Plus,
    Pencil,
    Trash,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { usePromotionsStore } from '@/store/usePromotionsStore';

export default function PromotionsPage() {
    const { promotions, isLoading, error, fetchPromotions, removePromotion } = usePromotionsStore();
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la promotion pour "${name}" ?`)) return;

        const success = await removePromotion(id);
        if (success) {
            setMessage({ text: "Promotion supprimée avec succès", type: "success" });
        } else {
            setMessage({ text: "Erreur lors de la suppression de la promotion", type: "error" });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    const filteredPromos = promotions.filter(p => {
        const title = `${p.finition?.carModel?.brand?.name || ''} ${p.finition?.carModel?.name || ''} ${p.finition?.name || ''}`.toLowerCase();
        return title.includes(search.toLowerCase());
    });

    return (
        <div className="p-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Inventaire Véhicules</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Promotions</h1>
                    <p className="text-zinc-500 font-medium italic">Gérez les offres et remises sur les finitions.</p>
                </div>
                <div className="relative group flex-1 max-w-md flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher une promotion..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                    <Link
                        href="/admin/promotions/new"
                        className="flex items-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouveau</span>
                    </Link>
                </div>
            </div>

            {message && (
                <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 border animate-in fade-in slide-in-from-top-4 ${message.type === "success" ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" : "bg-red-50/50 border-red-100 text-red-800"}`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm tracking-tight">{message.text}</span>
                </div>
            )}

            {error && (
                <div className="mb-8 p-6 rounded-3xl flex items-center gap-4 border bg-red-50/50 border-red-100 text-red-800 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Véhicule</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Prix Initial</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Prix Promo</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Période</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Chargement des promotions...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredPromos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <p className="text-zinc-500 font-bold italic">Aucune promotion trouvée.</p>
                                </td>
                            </tr>
                        ) : filteredPromos.map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                                            <img src={p.finition?.image || p.finition?.carModel?.image || ""} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{p.finition?.carModel?.brand?.name}</p>
                                            <p className="font-black text-zinc-900 leading-tight">{p.finition?.carModel?.name} <span className="text-emerald-600 italic font-medium">{p.finition?.name}</span></p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-zinc-400 line-through decoration-zinc-300">{p.price.toLocaleString('fr-FR')} MAD</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">{p.promotionalPrice?.toLocaleString('fr-FR') ?? 'N/A'} MAD</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-zinc-600">
                                            Du: {p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}
                                        </span>
                                        <span className="text-xs font-bold text-zinc-600">
                                            Au: {p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/promotions/${p.id}/edit`}
                                            className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-all"
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id, p.finition?.name || 'finition inconnue')}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                            title="Supprimer"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
