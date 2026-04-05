import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/actions/alaune.actions";

const FeaturedArticles = async () => {
    const { data: dbArticles = [], success } = await getArticles();

    if (!success || dbArticles.length === 0) {
        return null; // Or show a placeholder
    }

    // Limit to 9 articles for the grid
    const articles = dbArticles.slice(0, 9);
    return (
        <section className="py-24 bg-[#FDFDFF] selection:bg-emerald-100 selection:text-emerald-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-100 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                            À la <span className="text-emerald-500">une</span>
                        </h2>
                        <p className="text-lg text-zinc-500 font-medium max-w-xl">
                            Dernières actualités, guides d'achat et analyses pointues pour les passionnés et acheteurs.
                        </p>
                    </div>
                    <Link href="/alaune" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 text-zinc-900 font-bold hover:bg-zinc-100 transition-colors shrink-0">
                        Voir tout le magazine <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Magazine Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Row 1: 2 Large Cards (6 cols each) */}
                    {articles.slice(0, 2).map((article) => (
                        <Link href={`/alaune/${article.slug}`} key={article.id} className="col-span-1 md:col-span-6 group cursor-pointer block">
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-zinc-900">
                                {article.coverImage && (
                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg z-10">
                                    {article.category?.name || "À la une"}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">{article.title}</h3>
                            <p className="text-zinc-500 font-medium text-lg leading-relaxed line-clamp-2">{article.subtitle}</p>
                        </Link>
                    ))}

                    {/* Row 2: 4 Small Cards (3 cols each) */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        {articles.slice(2, 6).map((article) => (
                            <Link href={`/alaune/${article.slug}`} key={article.id} className="group cursor-pointer block">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-100">
                                    {article.coverImage && (
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">{article.category?.name || "Essai"}</span>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">{article.title}</h3>
                                <p className="text-zinc-500 text-sm line-clamp-2">{article.subtitle}</p>
                            </Link>
                        ))}
                    </div>

                    {/* Row 3: 3 Medium Cards (4 cols each) */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-10 border-t border-zinc-100/50">
                        {articles.slice(6, 9).map((article) => (
                            <Link href={`/alaune/${article.slug}`} key={article.id} className="flex gap-6 group cursor-pointer items-center block">
                                <div className="relative w-32 h-32 shrink-0 rounded-[1.5rem] overflow-hidden bg-zinc-100">
                                    {article.coverImage && (
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">{article.category?.name || "Marché"}</span>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">{article.title}</h3>
                                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{article.subtitle}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedArticles;
