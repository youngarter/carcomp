"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import TipTapEditor from "./tiptap-editor";
import { createArticle, updateArticle } from "@/lib/actions/alaune.actions";

interface Category {
    id: string;
    name: string;
}

interface ArticleFormProps {
    initialData?: any;
    categories: Category[];
}

export default function ArticleForm({ initialData, categories }: ArticleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
    const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", title ? title : "draft");

        const res = await fetch("/api/upload/alaune", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Erreur lors de l'upload");
        const data = await res.json();
        return data.url;
    };

    const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            // Optimistic loading string could be added here
            const url = await uploadImage(file);
            setCoverImage(url);
        } catch (error) {
            alert("Erreur upload cover");
        }
    };

    const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            const uploadedUrls = await Promise.all(files.map(uploadImage));
            setImages(prev => [...prev, ...uploadedUrls]);
        } catch (error) {
            alert("Erreur upload galerie");
        }
    };

    const removeGalleryImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            title,
            subtitle,
            content,
            coverImage,
            images,
            categoryId,
        };

        try {
            const res = initialData
                ? await updateArticle(initialData.id, payload)
                : await createArticle(payload);

            if (res.success) {
                router.push("/admin/alaune");
                router.refresh();
            } else {
                alert(res.error || "Erreur");
            }
        } catch (err) {
            alert("Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <Link href="/admin/alaune" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour à la liste</span>
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {initialData ? "Enregistrer les modifications" : "Publier l'article"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Section */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Titre de l'article *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white text-zinc-900 font-bold transition-all text-xl"
                                placeholder="Le titre accrocheur de votre article"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Sous-titre / Accroche</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={e => setSubtitle(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white text-zinc-900 transition-all font-medium"
                                placeholder="Un sous-titre optionnel pour donner du contexte"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Contenu *</label>
                            <TipTapEditor value={content} onChange={setContent} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Meta Section */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Catégorie *</label>
                            <select
                                required
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white text-zinc-900 transition-all"
                            >
                                <option value="" disabled>Sélectionner une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Image Principale (Cover)</label>
                            <div className="relative aspect-video rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden group">
                                {coverImage ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => setCoverImage("")} className="p-2 bg-red-500 rounded-xl text-white hover:scale-110 transition-transform">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center gap-2 cursor-pointer text-zinc-400 hover:text-emerald-500 transition-colors w-full h-full justify-center">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Ajouter une cover</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 px-2">Galerie d'images</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(i)}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:text-emerald-500 hover:border-emerald-500 transition-colors cursor-pointer bg-zinc-50">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Ajouter des images</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGallerySelect} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
