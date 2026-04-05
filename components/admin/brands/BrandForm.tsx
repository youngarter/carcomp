"use client";

import React, { useState } from "react";
import { Save, Loader2, Sparkles, Globe } from "lucide-react";
import { createBrand, updateBrand } from "@/lib/actions/brand.actions";
import { slugify } from "@/lib/slugify";
import ImageUploader from "./ImageUploader";

interface BrandFormProps {
    initialData?: any;
    onSuccess?: (brand?: any) => void;
}

export default function BrandForm({ initialData, onSuccess }: BrandFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        origin: initialData?.origin || "",
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: slugify(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const fd = new FormData(e.currentTarget);

        try {
            const result = initialData
                ? await updateBrand(initialData.id, fd)
                : await createBrand(fd);

            if (result.success) {
                if (onSuccess) onSuccess((result as any).brand);
            } else {
                setError(result.error || "Une erreur est survenue");
            }
        } catch (err: any) {
            setError(err.message || "Erreur lors de la soumission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">
                        Nom de la Marque <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        required
                        placeholder="Ex: Volkswagen, Toyota..."
                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            required
                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-zinc-500"
                        />
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">
                    Origine / Pays
                </label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                    <input
                        name="origin"
                        value={formData.origin}
                        onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                        placeholder="Ex: Allemande, Japonaise..."
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Histoire, positionnement de la marque..."
                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUploader
                    label="Logo de la Marque"
                    name="logo"
                    currentImage={initialData?.logo}
                />
                <ImageUploader
                    label="Image de couverture (Banner)"
                    name="image"
                    currentImage={initialData?.image}
                    aspectRatio="video"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-emerald-500" />}
                {initialData ? "Mettre à jour" : "Créer la marque"}
            </button>
        </form>
    );
}
