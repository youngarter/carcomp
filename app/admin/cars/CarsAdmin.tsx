"use client";

import React, { useState, useEffect } from "react";
import {
    Trash2,
    Eye,
    EyeOff,
    Search,
    Car as CarIcon,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Plus,
    Pencil,
    Trash
} from "lucide-react";
import { getFinitionCatalog, deleteFinition } from "@/app/car/actions";
import { Car } from "@/types/car";
import Link from "next/link";

import { toggleFinitionStatus, toggleFinitionPromotion } from "@/app/car/actions";

export default function CarsAdmin() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        setLoading(true);
        // Note: getFinitionCatalog filters out dead models by default now.
        // For admin, we need a version that shows everything.
        // Let's assume we'll add an 'includeDead' param to getFinitionCatalog or similar.
        // For now, I'll use a local fetch or update the action.
        const res = await fetch("/api/admin/cars");
        console.log("Admin cars fetch status:", res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Admin cars fetch failed:", res.status, errorData);
            setCars([]);
            setMessage({
                text: errorData.error || `Erreur serveur (${res.status})`,
                type: "error"
            });
            setLoading(false);
            return;
        }

        const data = await res.json();
        console.log("Admin cars data received:", data);

        if (Array.isArray(data)) {
            setCars(data);
        } else {
            console.error("API invalid data format (expected array):", data);
            setCars([]);
            setMessage({
                text: "Format de données invalide reçu du serveur",
                type: "error"
            });
        }
        setLoading(false);
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const res = await toggleFinitionStatus(id, !currentStatus);
        if (res.success) {
            setMessage({ text: "Statut mis à jour avec succès", type: "success" });
            loadCars();
        } else {
            setMessage({ text: "Erreur lors de la mise à jour", type: "error" });
        }
    };

    const handleTogglePromotion = async (id: string, currentPromoted: boolean) => {
        const res = await toggleFinitionPromotion(id, !currentPromoted);
        if (res.success) {
            setMessage({ text: currentPromoted ? "Retiré des promotions" : "Ajouté aux promotions", type: "success" });
            loadCars();
        } else {
            setMessage({ text: "Erreur lors de la mise à jour de la promotion", type: "error" });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la finition "${name}" ?`)) return;

        const res = await deleteFinition(id);
        if (res.success) {
            setMessage({ text: "Véhicule supprimé avec succès", type: "success" });
            loadCars();
        } else {
            setMessage({ text: res.error || "Erreur lors de la suppression", type: "error" });
        }
    };

    const filteredCars = Array.isArray(cars) ? cars.filter(c =>
        c.carModel?.brand?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.carModel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.name?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className="p-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <CarIcon className="w-3.5 h-3.5" />
                        <span>Inventaire Véhicules</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Gestion du Parc</h1>
                    <p className="text-zinc-500 font-medium italic">Gérez la visibilité des modèles sur la plateforme.</p>
                </div>
                <div className="relative group flex-1 max-w-md flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher un véhicule..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                    <Link
                        href="/admin/cars/new"
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

            <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Véhicule</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Slug</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Année</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">À la une</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Chargement de l'inventaire...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredCars.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <p className="text-zinc-500 font-bold italic">Aucun véhicule trouvé.</p>
                                </td>
                            </tr>
                        ) : filteredCars.map((car: any) => (
                            <tr key={car.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                                            <img src={car.image || car.carModel?.image || ""} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{car.carModel?.brand?.name}</p>
                                            <p className="font-black text-zinc-900 leading-tight">{car.carModel?.name} <span className="text-emerald-600 italic font-medium">{car.name}</span></p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <code className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-500">{car.slug}</code>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-zinc-600">{car.year || "N/A"}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <button
                                        onClick={() => handleTogglePromotion(car.id, car.isPromoted)}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors relative inline-flex items-center ${car.isPromoted ? "bg-emerald-500" : "bg-zinc-200"}`}
                                        title={car.isPromoted ? "Retirer des promotions" : "Mettre à la une"}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${car.isPromoted ? "translate-x-6" : "translate-x-0"}`} />
                                    </button>
                                </td>
                                <td className="px-8 py-6">
                                    {car.isDeadModel ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                            <EyeOff className="w-3 h-3" /> Hors Marché
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            <Eye className="w-3 h-3" /> Actif
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(car.id, car.isDeadModel)}
                                            className={`p-2 rounded-lg transition-all ${car.isDeadModel ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"}`}
                                            title={car.isDeadModel ? "Réactiver" : "Retirer"}
                                        >
                                            {car.isDeadModel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <Link
                                            href={`/admin/cars/${car.slug}/edit`}
                                            className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-all"
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(car.id, car.name)}
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
