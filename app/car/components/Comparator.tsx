"use client";
import React from "react";
import { X, Scale } from "lucide-react";
import { Car } from "../../../types/car";

interface ComparatorProps {
    vehicles: Car[];
    onRemove: (id: string) => void;
}

const Comparator = ({ vehicles, onRemove }: ComparatorProps) => {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-[40px] border border-black/5 shadow-2xl">
                <Scale className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-zinc-900 mb-4">Votre comparateur est vide</h3>
                <p className="text-zinc-500 font-medium">Ajoutez des véhicules depuis le catalogue pour comparer.</p>
            </div>
        );
    }

    const specs = [
        { label: "Prix", key: "price", format: (v: any) => `${v.toLocaleString("fr-FR")} DH` },
        { label: "Émission CO2", key: "specs.consoPerformances.co2Emission", format: (v: any) => `${v} g/km` },
        { label: "Consommation Mixte", key: "specs.consoPerformances.consoMixte", format: (v: any) => `${v} L/100` },
        { label: "Puissance", key: "specs.moteur.puissanceDynamique", format: (v: any) => v },
        { label: "Accélération 0-100", key: "specs.consoPerformances.acceleration", format: (v: any) => `${v} s` },
    ];

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return (
        <div className="overflow-x-auto pb-12">
            <div className="inline-flex min-w-full gap-8 pr-12">
                {vehicles.map((v) => (
                    <div key={v.id} className="w-[320px] flex-shrink-0">
                        {/* Card Header */}
                        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm relative mb-8">
                            <button
                                onClick={() => onRemove(v.id)}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="aspect-[16/10] rounded-2xl bg-zinc-50 overflow-hidden mb-6">
                                <img src={v.model?.imageUrl || "https://picsum.photos/seed/car/800/500"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{v.model?.brand?.name}</p>
                            <h3 className="text-xl font-black text-zinc-900">{v.model?.name}</h3>
                            <p className="text-xs font-bold text-emerald-600 mb-6">{v.name}</p>

                            <div className="flex items-center gap-4 py-4 border-t border-zinc-50">
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase font-black text-zinc-400">Score IA</span>
                                    <span className="text-lg font-black text-zinc-900">{v.model?.aiScore || 8.5}</span>
                                </div>
                                <div className="w-px h-8 bg-zinc-100" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase font-black text-zinc-400">Fiabilité</span>
                                    <span className="text-lg font-black text-zinc-900">{v.model?.reliability || 9.2}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specs List */}
                        <div className="space-y-4">
                            {specs.map((s, idx) => (
                                <div key={idx} className="p-6 bg-white rounded-3xl border border-black/5 flex flex-col items-center text-center shadow-sm">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">{s.label}</span>
                                    <span className="text-sm font-black text-zinc-900">{s.format(getNestedValue(v, s.key) || "N/A")}</span>
                                </div>
                            ))}

                            {/* Visual Indicators */}
                            <div className="p-8 bg-zinc-900 rounded-[40px] text-white space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Confort</span>
                                        <span>90%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[90%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Sécurité</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[85%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comparator;
