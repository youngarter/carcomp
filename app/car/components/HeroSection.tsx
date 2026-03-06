"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-bg.png"
                    alt="Luxury Car Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/40" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 backdrop-blur-xl text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] mb-12 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                >
                    <Sparkles className="w-3.5 h-3.5" /> Propulsé par l'Intelligence Artificielle
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-[5.5rem] font-black tracking-tight text-white leading-[0.9] mb-12"
                >
                    Trouvez la voiture <br />
                    <span className="text-emerald-500">qui vous ressemble</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-3xl mx-auto mb-16"
                >
                    Notre algorithme analyse vos besoins, votre style de vie et <br className="hidden md:block" /> votre budget pour vous recommander le véhicule idéal.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/car/diagnostic"
                        className="relative inline-flex items-center gap-4 px-12 py-7 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-[0.15em] text-sm hover:bg-emerald-400 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 group overflow-hidden"
                    >
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        LANCER LE DIAGNOSTIC IA
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
        </section>
    );
};

export default HeroSection;
