import React from "react";
import ArticleForm from "@/components/admin/article-form";
import { getCategories } from "@/lib/actions/alaune.actions";

export default async function CreateArticlePage() {
    const { data: categories = [] } = await getCategories();

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Nouvel Article</h1>
                <p className="text-zinc-500 font-medium mt-1">Rédigez un nouvel article pour la section À la une.</p>
            </div>

            <ArticleForm categories={categories as any[]} />
        </div>
    );
}
