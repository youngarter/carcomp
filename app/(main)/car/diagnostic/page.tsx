"use client";

import React from "react";
import Diagnostic from "@/app/(main)/car/_components/Diagnostic";
import { Sparkles } from "lucide-react";

export default function DiagnosticPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6">
                        <Sparkles className="w-3 h-3" /> Diagnostic Intelligent
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">
                        Trouvez votre <span className="text-emerald-600">voiture idéale</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto font-medium">
                        Répondez à quelques questions et laissez notre intelligence artificielle analyser
                        le marché marocain pour vous recommander les meilleurs véhicules.
                    </p>
                </div>

                <Diagnostic />
            </div>
        </main>
    );
}
