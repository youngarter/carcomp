import React from "react";
import { getCategories } from "@/lib/actions/alaune.actions";
import CategoryManagement from "./CategoryManagement";
import { FolderPlus } from "lucide-react";
import { Category } from "@/types/alaune.types";

export default async function CategoriesAdminPage() {
    const { data: categories = [], success } = await getCategories();

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                        <FolderPlus className="w-8 h-8 text-emerald-600" />
                        Gestion des Catégories
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1">Organisez vos articles par thématiques.</p>
                </div>
            </div>

            <CategoryManagement initialCategories={categories as Category[]} />
        </div>
    );
}
