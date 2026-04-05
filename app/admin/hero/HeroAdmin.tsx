"use client";

import React, { useState, useEffect } from "react";
import {
    Image as ImageIcon,
    Plus,
    Pencil,
    Trash,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Search,
    X,
    Save
} from "lucide-react";
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from "@/lib/actions/hero.actions";

export default function HeroAdmin() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        price: "",
        url: "",
        image: "",
        imageAlt: "",
        brandLogo: "",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setLoading(true);
        const data = await getHeroSlides();
        setSlides(data || []);
        setLoading(false);
    };

    const handleOpenModal = (slide?: any) => {
        if (slide) {
            setEditingId(slide.id);
            setFormData({
                title: slide.title || "",
                subtitle: slide.subtitle || "",
                description: slide.description || "",
                price: slide.price || "",
                url: slide.url || "",
                image: slide.image || "",
                imageAlt: slide.imageAlt || "",
                brandLogo: slide.brandLogo || "",
                order: slide.order || 0,
                isActive: slide.isActive,
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                subtitle: "",
                description: "",
                price: "",
                url: "",
                image: "",
                imageAlt: "",
                brandLogo: "",
                order: slides.length,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image) {
            setMessage({ text: "Titre et Image sont obligatoires.", type: "error" });
            return;
        }

        let res;
        if (editingId) {
            res = await updateHeroSlide(editingId, formData);
        } else {
            res = await createHeroSlide(formData);
        }

        if (res.success) {
            setMessage({ text: "Slide sauvegardé avec succès", type: "success" });
            handleCloseModal();
            loadSlides();
        } else {
            setMessage({ text: res.error || "Erreur de sauvegarde", type: "error" });
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const res = await updateHeroSlide(id, { isActive: !currentStatus });
        if (res.success) {
            setMessage({ text: "Statut mis à jour", type: "success" });
            loadSlides();
        } else {
            setMessage({ text: "Erreur lors de la mise à jour", type: "error" });
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Supprimer le slide "${title}" ?`)) return;

        const res = await deleteHeroSlide(id);
        if (res.success) {
            setMessage({ text: "Slide supprimé", type: "success" });
            loadSlides();
        } else {
            setMessage({ text: res.error || "Erreur lors de la suppression", type: "error" });
        }
    };

    return (
        <div className="p-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Carrousel Accueil</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Gestion du Hero Banner</h1>
                    <p className="text-zinc-500 font-medium italic">Gérez les diapositives principales affichées sur la page d'accueil.</p>
                </div>
                <div className="relative group flex-1 max-w-xs flex gap-4">
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un Slide</span>
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 border animate-in fade-in slide-in-from-top-4 ${message.type === "success" ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" : "bg-red-50/50 border-red-100 text-red-800"}`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm tracking-tight">{message.text}</span>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 w-24">Ordre</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Slide</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Prix</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Statut</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Chargement...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : slides.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <p className="text-zinc-500 font-bold italic">Aucun slide existant.</p>
                                </td>
                            </tr>
                        ) : slides.map((slide: any) => (
                            <tr key={slide.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-black text-zinc-500 text-xs">
                                        {slide.order}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-14 rounded-xl bg-zinc-950 overflow-hidden flex-shrink-0 relative">
                                            <img src={slide.image} alt="" className="w-full h-full object-cover opacity-80" />
                                            {slide.brandLogo && (
                                                <img src={slide.brandLogo} alt="" className="absolute top-1 left-1 w-4 h-4 object-contain brightness-0 invert" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{slide.subtitle}</p>
                                            <p className="font-black text-zinc-900 leading-tight">{slide.title}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-zinc-600 text-sm whitespace-nowrap">{slide.price}</span>
                                </td>
                                <td className="px-8 py-6">
                                    {slide.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            <Eye className="w-3 h-3" /> Visible
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                            <EyeOff className="w-3 h-3" /> Caché
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(slide.id, slide.isActive)}
                                            className={`p-2 rounded-lg transition-all ${slide.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"}`}
                                            title={slide.isActive ? "Cacher" : "Afficher"}
                                        >
                                            {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(slide)}
                                            className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-all"
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id, slide.title)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight">{editingId ? "Modifier le Slide" : "Nouveau Slide"}</h2>
                            <button onClick={handleCloseModal} className="p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-50 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Surtitre (Marque/Catégorie)</label>
                                    <input
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Ex: NOUVELLE PORSCHE"
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Titre Principal <span className="text-red-500">*</span></label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: TAYCAN TURBO S"
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Une phrase d'accroche pour la promotion..."
                                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium resize-none h-24"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Prix affiché</label>
                                <input
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Ex: À partir de 450 000 DH"
                                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">URL Image Principale <span className="text-red-500">*</span></label>
                                    <input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Texte Alternatif (Alt) Image</label>
                                    <input
                                        value={formData.imageAlt}
                                        onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                                        placeholder="Ex: Voiture de sport rouge"
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Lien de Redirection (URL)</label>
                                <input
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="Ex: /car/porsche-taycan ou https://..."
                                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">URL Logo Marque (Optionnel)</label>
                                    <input
                                        value={formData.brandLogo}
                                        onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Ordre d'affichage</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <div
                                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? "bg-emerald-500" : "bg-zinc-200"}`}
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-0"}`} />
                                </div>
                                <span className="font-bold text-sm text-zinc-700">Slide actif (Visible sur le site)</span>
                            </div>

                        </div>

                        <div className="p-6 border-t border-zinc-100 flex justify-end gap-4 bg-zinc-50/50">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                            >
                                <Save className="w-4 h-4" />
                                <span>{editingId ? "Enregistrer" : "Créer le Slide"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
