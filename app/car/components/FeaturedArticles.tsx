import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const articles = [
    // 2 Large Cards (Row 1)
    { id: 1, size: "large", tag: "Guide d'Achat", title: "Voitures les plus fiables 2025", desc: "Notre analyse IA des marques qui vous coûteront le moins cher à l'entretien au Maroc.", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop" },
    { id: 2, size: "large", tag: "Dossier Spécial", title: "Top 10 SUV au Maroc", desc: "Le classement ultime des SUV familiaux combinant espace, sécurité et efficience.", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop" },

    // 4 Small Cards (Row 2)
    { id: 3, size: "small", tag: "Essai", title: "Nouvelle Dacia Duster", desc: "Le rapport qualité/prix toujours au rendez-vous ?", img: "https://images.unsplash.com/photo-1629897048514-3dd7414df7fd?q=80&w=800&auto=format&fit=crop" },
    { id: 4, size: "small", tag: "Tech", title: "L'IA dans votre auto", desc: "Comment les aides à la conduite transforment nos trajets.", img: "https://images.unsplash.com/photo-1549419137-ed8a719bf300?q=80&w=800&auto=format&fit=crop" },
    { id: 5, size: "small", tag: "Analyse", title: "Hybrid vs Diesel", desc: "Quel choix est le plus rentable aujourd'hui ?", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop" },
    { id: 6, size: "small", tag: "Conseil", title: "Guide achat citadine", desc: "Les meilleures finitions pour le trafic urbain.", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop" },

    // 3 Medium Cards (Row 3)
    { id: 7, size: "medium", tag: "Marché", title: "L'électrique au Maroc", desc: "État des lieux des bornes de recharge en 2025.", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop" },
    { id: 8, size: "medium", tag: "Entretien", title: "Prolonger la vie de sa voiture", desc: "5 règles d'or pour prévenir les pannes coûteuses.", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop" },
    { id: 9, size: "medium", tag: "Législation", title: "Nouvelles taxes auto", desc: "Ce qui change pour la vignette fiscale cette année.", img: "https://images.unsplash.com/photo-1542360214-72c05f77fa09?q=80&w=1000&auto=format&fit=crop" },
];

const FeaturedArticles = () => {
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
                    <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 text-zinc-900 font-bold hover:bg-zinc-100 transition-colors shrink-0">
                        Voir tout le magazine <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Magazine Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Row 1: 2 Large Cards (6 cols each) */}
                    {articles.slice(0, 2).map((article) => (
                        <div key={article.id} className="col-span-1 md:col-span-6 group cursor-pointer">
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-zinc-900">
                                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                    {article.tag}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">{article.title}</h3>
                            <p className="text-zinc-500 font-medium text-lg leading-relaxed">{article.desc}</p>
                        </div>
                    ))}

                    {/* Row 2: 4 Small Cards (3 cols each) */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        {articles.slice(2, 6).map((article) => (
                            <div key={article.id} className="group cursor-pointer">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-100">
                                    <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">{article.tag}</span>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug">{article.title}</h3>
                                <p className="text-zinc-500 text-sm line-clamp-2">{article.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Row 3: 3 Medium Cards (4 cols each) */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-10 border-t border-zinc-100/50">
                        {articles.slice(6, 9).map((article) => (
                            <div key={article.id} className="flex gap-6 group cursor-pointer items-center">
                                <div className="relative w-32 h-32 shrink-0 rounded-[1.5rem] overflow-hidden bg-zinc-100">
                                    <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">{article.tag}</span>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">{article.title}</h3>
                                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{article.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedArticles;
