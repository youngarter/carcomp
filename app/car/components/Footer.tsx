"use client";

import React from "react";
import { Car, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 md:col-span-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 mb-8 group"
                        >
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                                <Car className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                AUTO<span className="text-emerald-600">ADVISOR</span>
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8 max-w-xs">
                            Votre conseiller automobile intelligent au Maroc. Nous utilisons l&apos;IA pour vous aider à prendre la meilleure décision d&apos;achat.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:bg-zinc-700 transition-all">
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Plateforme</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Catalogue Neuf</Link></li>
                            <li><Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Occasions</Link></li>
                            <li><Link href="/car/diagnostic" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Diagnostic IA</Link></li>
                            <li><Link href="/car/compare" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Comparateur</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Cote de l&apos;occasion</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Assurance Auto</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Crédit Auto</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Essais & Actualités</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex items-center gap-4 text-sm font-bold text-zinc-400">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-500"><Phone className="w-4 h-4" /></div>
                                +212 5 22 00 00 00
                            </li>
                            <li className="flex items-center gap-4 text-sm font-bold text-zinc-400">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-500"><Mail className="w-4 h-4" /></div>
                                contact@autoadvisor.ma
                            </li>
                            <li className="flex items-center gap-4 text-sm font-bold text-zinc-400">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-500"><MapPin className="w-4 h-4" /></div>
                                Casablanca, Maroc
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">© 2024 AutoAdvisor AI. Tous droits réservés.</p>
                    <div className="flex gap-10">
                        {["Mentions légales", "Confidentialité", "Cookies"].map((item) => (
                            <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
