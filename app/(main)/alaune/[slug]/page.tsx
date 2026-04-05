import React from "react";
import { getArticleBySlug } from "@/lib/actions/alaune.actions";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: article } = await getArticleBySlug(slug);

    if (!article) return {};

    return {
        title: `${article.title} - AutoAdvisor AI`,
        description: article.subtitle || "L'actualité automobile sur AutoAdvisor AI.",
        openGraph: {
            title: article.title,
            description: article.subtitle || "",
            images: article.coverImage ? [article.coverImage] : [],
        },
    };
}

export default async function ArticleDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const { data: article, success } = await getArticleBySlug(slug);

    if (!success || !article) {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen pt-32 pb-24">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 mb-12">
                <Link href="/alaune" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors font-bold text-sm mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux articles
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-black uppercase tracking-widest rounded-full">
                        {article.category?.name || "Actualité"}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-400 font-medium text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-tight mb-6">
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed mb-8">
                        {article.subtitle}
                    </p>
                )}

                {/* Author & Share */}
                <div className="flex items-center justify-between py-6 border-y border-zinc-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-xl">
                            A
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900">AutoAdvisor Team</div>
                            <div className="text-sm font-medium text-zinc-500">Rédaction Centrale</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden md:inline-block">Partager</span>
                        <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <div className="aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-zinc-100 relative shadow-2xl">
                    {article.coverImage && (
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6">
                <div
                    className="prose prose-lg prose-zinc max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-3xl"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Additional Images Gallery */}
                {article.images && article.images.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-zinc-100">
                        <h3 className="text-2xl font-black text-zinc-900 mb-8 tracking-tight">Galerie</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {article.images.map((img, idx) => (
                                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 relative group">
                                    <Image
                                        src={img}
                                        alt={`${article.title} - Galerie Image ${idx + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
