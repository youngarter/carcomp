"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPromotion, updatePromotion } from '@/lib/actions/promotion.actions';
import { Tag, ArrowLeft, Save } from 'lucide-react';
import { Promotion } from '@/types/promotion';

export default function EditPromotionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);
    const router = useRouter();
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getPromotion(id).then((data) => {
            if (data) {
                setPromotion(data);
            } else {
                setError("Promotion introuvable");
            }
            setFetching(false);
        }).catch(err => {
            setError("Erreur lors du chargement: " + err.message);
            setFetching(false);
        });
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            await updatePromotion(id, {
                price: Number(formData.get('price')),
                promotionalPrice: Number(formData.get('promotionalPrice')),
                startDate: new Date(formData.get('startDate') as string),
                endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
                isPromotion: formData.get('isPromotion') === 'on',
            });
            // The action redirects, so we shouldn't hit here, but just in case:
            router.push('/admin/promotions');
        } catch (err: any) {
            setError(err.message || "Failed to edit promotion");
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="p-12 text-center">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Chargement...</p>
            </div>
        );
    }

    if (!promotion) {
        return (
            <div className="p-12 text-center text-red-600 font-bold">
                {error || "Promotion introuvable"}
            </div>
        );
    }

    return (
        <div className="p-12 max-w-4xl mx-auto">
            <Link href="/admin/promotions" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Retour aux promotions
            </Link>

            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Tag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Éditer la Promotion</h1>
                        <p className="text-zinc-500 font-medium">Modifier les détails de l'offre sur cette finition.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm mb-8 relative z-10">
                <div className="p-6 bg-emerald-50/30 border-b border-zinc-100 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden flex-shrink-0 border border-emerald-100 shadow-sm flex items-center justify-center p-2">
                        {promotion.finition?.image || promotion.finition?.carModel?.image ? (
                            <img src={promotion.finition?.image || promotion.finition?.carModel?.image || ""} alt={promotion.finition?.name} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-zinc-300 font-black text-xs uppercase tracking-widest">No Image</span>
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{promotion.finition?.carModel?.brand?.name}</div>
                        <h3 className="font-black text-2xl text-zinc-900 leading-none mb-1">
                            {promotion.finition?.carModel?.name} <span className="text-emerald-600">{promotion.finition?.name}</span>
                        </h3>
                        <p className="text-sm font-bold text-zinc-500">
                            Finition ID: <span className="font-mono text-zinc-400">{promotion.finitionId}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3 flex items-center pt-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input name="isPromotion" type="checkbox" defaultChecked={promotion.isPromotion} className="peer sr-only" />
                                    <div className="block w-14 h-8 bg-zinc-200 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
                                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                                </div>
                                <span className="font-bold text-zinc-700 uppercase tracking-widest text-sm group-hover:text-emerald-600 transition-colors">Promotion Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Prix Initial (MAD)</label>
                            <input name="price" type="number" step="0.01" required defaultValue={promotion.price} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest text-emerald-600">Prix Promotionnel (MAD)</label>
                            <input name="promotionalPrice" type="number" step="0.01" required defaultValue={promotion.promotionalPrice} className="w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-emerald-800" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Date de Début</label>
                            <input name="startDate" type="date" required defaultValue={promotion.startDate?.split('T')[0]} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-zinc-600" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Date de Fin (Optionnel)</label>
                            <input name="endDate" type="date" defaultValue={promotion.endDate?.split('T')[0]} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-zinc-600" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100">
                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Save className="w-5 h-5" />
                            {loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
