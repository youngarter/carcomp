import React from "react";
import ArticleForm from "@/components/admin/article-form";
import { getArticleById, getCategories } from "@/lib/actions/alaune.actions";
import { redirect } from "next/navigation";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { data: article, success } = await getArticleById(id);
    const { data: categories = [] } = await getCategories();

    if (!success || !article) {
        redirect("/admin/alaune");
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Modifier l'Article</h1>
                <p className="text-zinc-500 font-medium mt-1">Mettez à jour les informations de cet article.</p>
            </div>

            <ArticleForm initialData={article} categories={categories as any[]} />
        </div>
    );
}
