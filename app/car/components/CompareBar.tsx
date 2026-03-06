"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";
import Link from "next/link";
import { useStore } from "../../../store/useStore";
import { usePathname } from "next/navigation";

export default function CompareBar() {
    const { comparingTrims, clearComparison } = useStore();
    const pathname = usePathname();

    // Don't show the bar on the comparison page itself
    if (pathname === "/car/compare") return null;

    return (
        <AnimatePresence>
            {comparingTrims.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6"
                >
                    <div className="bg-zinc-900/95 backdrop-blur-xl text-white rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black tracking-tight">{comparingTrims.length} véhicules sélectionnés</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Prêt pour la comparaison</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearComparison}
                                className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Vider
                            </button>
                            <Link
                                href="/car/compare"
                                className="px-8 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Comparer
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
