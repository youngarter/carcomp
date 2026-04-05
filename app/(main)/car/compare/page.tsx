"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import Comparator from "@/app/(main)/car/_components/Comparator";
import { Scale } from "lucide-react";

export default function ComparePage() {
    const { comparingTrims, removeTrimFromCompare } = useStore();

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-zinc-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6">
                            <Scale className="w-3 h-3" /> Comparateur
                        </div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                            Comparez les <span className="text-emerald-600">modèles</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-zinc-900">{comparingTrims.length}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Véhicules sélectionnés</p>
                    </div>
                </div>

                <Comparator
                    vehicles={comparingTrims}
                    onRemove={removeTrimFromCompare}
                />
            </div>
        </main>
    );
}
