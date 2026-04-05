"use client";

import React from "react";
import { Car, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="bg-zinc-950 text-white pt-32 pb-12 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

                    {/* Brand & Newsletter */}
                    <div className="col-span-1 md:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                                <Car className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                AUTO<span className="text-emerald-500">ADVISOR</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-8 max-w-sm">
                            La plateforme de comparaison automobile propulsée par l'Intelligence Artificielle. Trouvez le véhicule fait pour vous.
                        </p>

                        <div className="mb-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-4">Newsletter</h4>
                            <div className="relative flex items-center">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
                                />
                                <button className="absolute right-2 p-2.5 bg-emerald-600 rounded-full hover:bg-emerald-500 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all">
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10 md:pl-10">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-8">Plateforme</h4>
                            <ul className="space-y-4">
                                <li><Link href="/" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Accueil</Link></li>
                                <li><Link href="/" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Catalogue Neuf</Link></li>
                                <li><Link href="/car/diagnostic" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Diagnostic IA</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-8">Compare</h4>
                            <ul className="space-y-4">
                                <li><Link href="/car/compare" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Comparateur IA</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Véhicules Populaires</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Marques</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-8">Guides</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Articles & Tendances</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Guide d'achat 2025</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Hybride vs Diesel</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-8">Légal</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Mentions légales</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Confidentialité</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">Gestion des cookies</Link></li>
                                <li><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors">CGU / CGV</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-zinc-500">© {new Date().getFullYear()} AutoAdvisor AI. Tous droits réservés.</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        Design & Innovation in Casablanca, MA
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
