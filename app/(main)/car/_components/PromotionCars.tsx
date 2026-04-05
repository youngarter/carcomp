"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import VehicleCard from "@/components/shared/VehicleCard";
import { FinitionCard } from "@/types/car.types";
import { getPromotedCars } from "@/lib/actions/car.actions";
import Link from "next/link";

interface PromotionCarsProps {
    onCompare: (car: FinitionCard) => void;
    comparingTrims: FinitionCard[];
}

const PromotionCars = ({ onCompare, comparingTrims }: PromotionCarsProps) => {
    const [displayCars, setDisplayCars] = useState<FinitionCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPromoted() {
            setLoading(true);
            try {
                const data = await getPromotedCars();
                setDisplayCars(data as any);
            } catch (error) {
                console.error("Error loading promoted cars:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPromoted();
    }, []);

    return (
        <section className="py-32 bg-[#FDFDFF] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100/50 shadow-sm animate-fade-in-up">
                        <Sparkles className="w-3.5 h-3.5" />
                        Offres exclusives
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight mb-6 leading-[1.1]">
                        Nos meilleures <span className="text-emerald-500 relative inline-block">
                            Promotions
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-100 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-500 font-medium max-w-2xl leading-relaxed">
                        Découvrez une sélection rigoureuse des offres les plus compétitives du marché, analysées par notre intelligence artificielle.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-zinc-50 rounded-[2.5rem] aspect-[1/1.2] animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
                            </div>
                        ))}
                    </div>
                ) : displayCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayCars.map((car) => (
                            <VehicleCard
                                key={car.id}
                                trim={car}
                                onCompare={onCompare}
                                isComparing={!!comparingTrims.find((ct) => ct.id === car.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-32 flex flex-col items-center justify-center bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-100">
                        <p className="text-zinc-400 font-bold text-lg">Aucune promotion disponible pour le moment.</p>
                    </div>
                )}

                <div className="mt-20 text-center">
                    <Link
                        href="/cars"
                        className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white border-2 border-zinc-100 text-zinc-900 font-black uppercase tracking-[0.2em] text-xs hover:border-emerald-500 hover:text-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group"
                    >
                        Voir plus de voitures
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PromotionCars;
