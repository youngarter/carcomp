import React from "react";
import Link from "next/link";
import { getArticles } from "@/lib/actions/alaune.actions";
import { Article } from "@/types/alaune.types";

export const metadata = {
    title: "À la une - AutoAdvisor AI",
    description: "Toute l'actualité automobile, essais, et conseils de pro par AutoAdvisor AI.",
};

export default async function AlaUneHomePage() {
    const { data: articles = [], success } = await getArticles();

    if (!success || articles.length === 0) {
        return (
            <div className="pt-32 pb-24 text-center max-w-7xl mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-4">À la une</h1>
                <p className="text-zinc-500 text-lg mb-12 max-w-2xl mx-auto">Toute l'actualité automobile en continu.</p>
                <div className="py-24 bg-white rounded-3xl border border-zinc-100">
                    <h3 className="text-2xl font-bold text-zinc-900">Aucun article pour le moment.</h3>
                </div>
            </div>
        );
    }

    const featuredArticle = articles[0];
    const gridArticles = articles.slice(1);

    return (
        <div className="bg-[#F9FAFB] min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-6 uppercase">
                        À la <span className="text-emerald-500">une</span>
                    </h1>
                    <p className="text-lg text-zinc-600 max-w-2xl mx-auto font-medium">
                        L'actualité automobile décryptée. Tendances, essais, exclusivités et dossiers spéciaux.
                    </p>
                </div>

                {/* Categories Filter (Placeholder layout) */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    <button className="px-6 py-2 bg-zinc-900 text-white font-bold rounded-full text-sm hover:scale-105 transition-transform">
                        Tous
                    </button>
                    <button className="px-6 py-2 bg-white text-zinc-600 font-bold border border-zinc-200 rounded-full text-sm hover:bg-zinc-50 transition-colors">
                        Essais
                    </button>
                    <button className="px-6 py-2 bg-white text-zinc-600 font-bold border border-zinc-200 rounded-full text-sm hover:bg-zinc-50 transition-colors">
                        Nouveautés
                    </button>
                </div>

                {/* Hero Featured Article (Mashable-style) */}
                {featuredArticle && (
                    <Link href={`/alaune/${featuredArticle.slug}`} className="block group mb-12">
                        <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-xl bg-zinc-900">
                            {featuredArticle.coverImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={featuredArticle.coverImage}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 md:p-12">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-full">
                                            {featuredArticle.category?.name || "À la une"}
                                        </span>
                                        <span className="text-white/80 font-bold text-sm">
                                            {new Date(featuredArticle.createdAt).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    {featuredArticle.subtitle && (
                                        <p className="text-lg md:text-xl text-white/80 font-medium line-clamp-2">
                                            {featuredArticle.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Grid of Articles */}
                {gridArticles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridArticles.map((article: Article) => (
                            <Link href={`/alaune/${article.slug}`} key={article.id} className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                                    {article.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-200" />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                            {article.category?.name || "Actualité"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-xs font-bold text-zinc-400 mb-3">
                                        {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                    </div>
                                    <h3 className="text-xl font-black text-zinc-900 leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    {article.subtitle && (
                                        <p className="text-zinc-500 font-medium line-clamp-2 text-sm">
                                            {article.subtitle}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
