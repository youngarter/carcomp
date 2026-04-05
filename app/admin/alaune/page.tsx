import React from "react";
import Link from "next/link";
import { getArticles, deleteArticle } from "@/lib/actions/alaune.actions";
import { Plus, Edit, Trash2, Calendar, LayoutTemplate } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteArticleButton from "@/components/admin/alaune/DeleteArticleButton";

export default async function AlaUneAdminPage() {
    const { data: articles, success } = await getArticles();

    async function handleDelete(id: string) {
        "use server";
        await deleteArticle(id);
        revalidatePath("/admin/alaune");
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">À la une (Blog)</h1>
                    <p className="text-zinc-500 font-medium mt-1">Gérez les articles de votre blog Mashable-style.</p>
                </div>
                <Link
                    href="/admin/alaune/create"
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <Plus className="w-5 h-5" />
                    Créer un Article
                </Link>
            </div>

            {/* Articles List */}
            {!success || !articles || articles.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                    <LayoutTemplate className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucun article trouvé</h3>
                    <p className="text-zinc-500 mb-6">Commencez par rédiger votre premier article pour la section À la une.</p>
                    <Link
                        href="/admin/alaune/create"
                        className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvel Article
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {articles.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex gap-6 items-center flex-1">
                                {article.coverImage ? (
                                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-20 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 flex-shrink-0">
                                        <LayoutTemplate className="w-8 h-8 opacity-50" />
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {article.category?.name || "Général"}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">{article.title}</h3>
                                    {article.subtitle && (
                                        <p className="text-sm text-zinc-500 line-clamp-1 mt-1">{article.subtitle}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/alaune/edit/${article.id}`}
                                    className="p-3 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                    title="Modifier"
                                >
                                    <Edit className="w-5 h-5" />
                                </Link>
                                <DeleteArticleButton articleId={article.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
