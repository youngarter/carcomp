"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/alaune.actions";
import { Category } from "@/types/alaune.types";
// import { toast } from "sonner"; // Temporarily commented out due to installation issue

interface CategoryManagementProps {
    initialCategories: Category[];
}

export default function CategoryManagement({ initialCategories }: CategoryManagementProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleAdd() {
        if (!newName.trim()) return;
        setIsLoading(true);
        const result = await createCategory({ name: newName });
        if (result.success && result.data) {
            setCategories([...categories, result.data as Category]);
            setNewName("");
            alert("Catégorie ajoutée");
        } else {
            alert(result.error || "Erreur");
        }
        setIsLoading(false);
    }

    async function handleUpdate(id: string) {
        if (!newName.trim()) return;
        setIsLoading(true);
        const result = await updateCategory(id, { name: newName });
        if (result.success && result.data) {
            setCategories(categories.map(c => c.id === id ? result.data as Category : c));
            setIsEditing(null);
            setNewName("");
            alert("Catégorie mise à jour");
        } else {
            alert(result.error || "Erreur");
        }
        setIsLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
        setIsLoading(true);
        const result = await deleteCategory(id);
        if (result.success) {
            setCategories(categories.filter(c => c.id !== id));
            alert("Catégorie supprimée");
        } else {
            alert(result.error || "Erreur");
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                    <Plus className="w-6 h-6 text-emerald-600" />
                    {isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
                </h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nom de la catégorie (ex: Essais, Nouveautés...)"
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleUpdate(isEditing)}
                                disabled={isLoading}
                                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Enregistrer"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(null);
                                    setNewName("");
                                }}
                                className="bg-zinc-100 text-zinc-600 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={isLoading}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            {isLoading ? "..." : "Ajouter"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900">{category.name}</h4>
                                <p className="text-xs text-zinc-400 font-medium">/{category.slug}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setIsEditing(category.id);
                                    setNewName(category.name);
                                }}
                                className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                    <FolderOpen className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune catégorie</h3>
                    <p className="text-zinc-500">Commencez par créer une catégorie pour classer vos articles.</p>
                </div>
            )}
        </div>
    );
}
