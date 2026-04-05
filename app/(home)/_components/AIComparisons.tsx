import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
    {
        id: 1,
        car1: { name: "Toyota Corolla", img: "https://images.unsplash.com/photo-1629897048514-3dd7414df7fd?q=80&w=800&auto=format&fit=crop", score: 8.8 },
        car2: { name: "Hyundai Elantra", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop", score: 8.5 },
        metrics: {
            reliability: { winner: 1, text: "Fiabilité à long terme supérieure" },
            fuel: { winner: 2, text: "Consommation légèrement meilleure (Hybride)" },
            cost: { winner: 1, text: "Coût d'entretien plus faible" },
        },
        verdict: "La Corolla reste le choix le plus sûr pour la durabilité et la valeur de revente sur le marché marocain."
    },
    {
        id: 2,
        car1: { name: "Peugeot 3008", img: "https://images.unsplash.com/photo-1549419137-ed8a719bf300?q=80&w=800&auto=format&fit=crop", score: 8.6 },
        car2: { name: "VW Tiguan", img: "https://images.unsplash.com/photo-1542360214-72c05f77fa09?q=80&w=800&auto=format&fit=crop", score: 8.9 },
        metrics: {
            reliability: { winner: 2, text: "Finition intérieure et robustesse" },
            fuel: { winner: 1, text: "Moteurs BlueHDi plus économiques" },
            cost: { winner: 2, text: "Valeur de revente nettement supérieure" },
        },
        verdict: "Le Tiguan justifie son prix supérieur par une meilleure conservation de valeur et une finition premium."
    },
    {
        id: 3,
        car1: { name: "Tesla Model 3", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop", score: 9.4 },
        car2: { name: "BMW i4", img: "https://images.unsplash.com/photo-1647895166416-8321683be83c?q=80&w=800&auto=format&fit=crop", score: 9.2 },
        metrics: {
            reliability: { winner: 1, text: "Efficience énergétique (Autonomie)" },
            fuel: { winner: 1, text: "Réseau de recharge Supercharger" },
            cost: { winner: 2, text: "Dynamisme de conduite et confort" },
        },
        verdict: "La Tesla l'emporte de justesse grâce à son écosystème logiciel et son efficience inégalée."
    }
];

const AIComparisons = () => {
    return (
        <section className="py-24 bg-[#FDFDFF] relative overflow-hidden" id="comparisons">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 md:flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                            <Sparkles className="w-4 h-4" /> Analyse en profondeur
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
                            Comparaisons <span className="text-emerald-500">intelligentes</span>
                        </h2>
                    </div>
                    <button className="mt-6 md:mt-0 text-zinc-900 font-bold uppercase tracking-widest text-xs hover:text-emerald-500 transition-colors">
                        Accéder au comparateur complet &rarr;
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comparisons.map((comp) => (
                        <div key={comp.id} className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-zinc-100/50 hover:shadow-[0_20px_50px_rgba(16,185,129,0.05)] transition-all duration-500 flex flex-col group">
                            {/* VS Banner */}
                            <div className="flex gap-2 mb-6 h-40">
                                <div className="relative w-1/2 h-full rounded-2xl overflow-hidden shadow-inner">
                                    <img src={comp.car1.img} alt={comp.car1.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20">
                                        {comp.car1.score}
                                    </div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 mt-16 w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-zinc-900 shadow-xl border-4 border-[#FDFDFF] z-10 text-sm">
                                    VS
                                </div>
                                <div className="relative w-1/2 h-full rounded-2xl overflow-hidden shadow-inner">
                                    <img src={comp.car2.img} alt={comp.car2.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20">
                                        {comp.car2.score}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8 px-2">
                                <span className="font-bold text-zinc-900 truncate w-[45%] text-left">{comp.car1.name}</span>
                                <span className="font-bold text-zinc-900 truncate w-[45%] text-right">{comp.car2.name}</span>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-4 mb-8 flex-grow">
                                {Object.values(comp.metrics).map((metric, i) => (
                                    <div key={i} className="flex gap-3 text-sm p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div className="shrink-0 pt-0.5">
                                            <CheckCircle2 className={`w-4 h-4 ${metric.winner === 1 ? 'text-zinc-600' : 'text-emerald-500'}`} />
                                        </div>
                                        <span className="text-zinc-600 font-medium leading-tight text-[13px]">{metric.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Verdict */}
                            <div className="bg-emerald-50/50 p-5 rounded-[1.5rem] border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verdict de l'IA</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-800 leading-relaxed">
                                    {comp.verdict}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Soft decorative blur */}
            <div className="absolute top-40 right-[-100px] w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
};

export default AIComparisons;
