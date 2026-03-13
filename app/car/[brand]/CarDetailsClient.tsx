"use client";

import React, { useState } from "react";
import { Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TechnicalSpecs from "../components/TechnicalSpecs";
import PredictiveIntelligence from "../components/PredictiveIntelligence";
import { useStore } from "../../../store/useStore";
import { Car } from "../../../types/car";

interface CarDetailsClientProps {
    car: Car;
}

export default function CarDetailsClient({ car }: CarDetailsClientProps) {
    const { comparingTrims, addTrimToCompare } = useStore();
    const [detailTab, setDetailTab] = useState("specs");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const isComparing = !!comparingTrims.find(t => t.id === car.id);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="aspect-video rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-zinc-200/50 border border-zinc-100">
                        <img
                            src={selectedImage || car.model.imageUrl}
                            alt={car.model.name}
                            className="w-full h-full object-cover transition-all duration-500"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    {car.images && car.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-4">
                            <div
                                onClick={() => setSelectedImage(car.model.imageUrl)}
                                className={`aspect-square rounded-2xl bg-zinc-100 overflow-hidden cursor-pointer border-2 transition-all ${(!selectedImage || selectedImage === car.model.imageUrl) ? "border-emerald-500 scale-95 shadow-inner" : "border-transparent hover:border-zinc-300"}`}
                            >
                                <img
                                    src={car.model.imageUrl}
                                    alt="Vue principale"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            {car.images.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-2xl bg-zinc-100 overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? "border-emerald-500 scale-95 shadow-inner" : "border-transparent hover:border-zinc-300"}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Aperçu ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                        {car.model.category}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-zinc-900 mb-2 tracking-tight leading-[1.1]">
                        {car.model.brand.name} <span className="text-emerald-600">{car.model.name}</span>
                    </h1>
                    <p className="text-2xl font-bold text-zinc-400 mb-8">
                        Finition : {car.name} — <span className="text-emerald-600 font-black">{car.price.toLocaleString("fr-FR")} DH</span>
                    </p>

                    <div className="grid grid-cols-2 gap-8 p-8 bg-white rounded-[40px] border border-zinc-100 shadow-sm mb-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Energie</p>
                            <p className="font-bold text-zinc-900 text-lg">{car.specs.moteur.energie}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Boîte</p>
                            <p className="font-bold text-zinc-900 text-lg">{car.specs.moteur.boiteAVitesse}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Puissance</p>
                            <p className="font-bold text-zinc-900 text-lg">{car.specs.moteur.puissanceDynamique}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Conso. Mixte</p>
                            <p className="font-bold text-zinc-900 text-lg">{car.specs.consoPerformances.consoMixte} L/100</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 py-5 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
                            Demander un devis
                        </button>
                        <button
                            onClick={() => addTrimToCompare(car)}
                            className={`flex-1 py-5 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all ${isComparing ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "border-zinc-100 text-zinc-600 hover:bg-zinc-50"}`}
                        >
                            {isComparing ? "Dans le comparateur" : "Comparer"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                <div className="flex gap-12 border-b border-zinc-100 overflow-x-auto no-scrollbar">
                    {["specs", "predictive", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setDetailTab(tab)}
                            className={`pb-6 text-sm font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap ${detailTab === tab ? "text-emerald-600 border-emerald-600" : "text-zinc-400 border-transparent hover:text-zinc-900"}`}
                        >
                            {tab === "specs" ? "Fiche Technique" : tab === "predictive" ? "Intelligence IA" : "Avis & Notation"}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {detailTab === "specs" && (
                        <motion.div key="specs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <TechnicalSpecs specs={car.specs} />
                        </motion.div>
                    )}
                    {detailTab === "predictive" && (
                        <motion.div key="predictive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <PredictiveIntelligence trim={car} />
                        </motion.div>
                    )}
                    {detailTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 bg-white rounded-[40px] border border-black/5 shadow-sm">
                                    <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                                        <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" /> Note Globale IA
                                    </h3>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="text-6xl font-black text-zinc-900">8.8</div>
                                        <div className="flex flex-col">
                                            <div className="flex text-emerald-500 gap-1">
                                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-5 h-5 ${i === 5 ? 'opacity-30' : 'fill-current'}`} />)}
                                            </div>
                                            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">Basé sur 1.2k avis</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-900 mb-2 uppercase tracking-widest">Points Forts</p>
                                            <p className="text-sm text-emerald-800 font-medium leading-relaxed">Excellent rapport qualité/prix, consommation maîtrisée, confort de suspension.</p>
                                        </div>
                                        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                                            <p className="text-[10px] font-black text-rose-900 mb-2 uppercase tracking-widest">Points Faibles</p>
                                            <p className="text-sm text-rose-800 font-medium leading-relaxed">Insonorisation à haute vitesse, plastiques intérieurs durs.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-white rounded-[40px] border border-black/5 shadow-sm">
                                    <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" /> Résumé Automatique IA
                                    </h3>
                                    <p className="text-lg text-zinc-500 leading-relaxed mb-8 font-medium italic">
                                        &quot;Le {car.model.name} s&apos;impose comme une référence sur le marché marocain pour ceux qui cherchent la polyvalence sans se ruiner. Sa motorisation {car.specs.moteur.motorisation} offre un bon compromis entre dynamisme et économie. Idéal pour les familles urbaines.&quot;
                                    </p>
                                    <div className="flex items-center gap-4 p-6 bg-zinc-50 rounded-3xl">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-200" />
                                        <div>
                                            <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Dernier avis utilisateur</p>
                                            <p className="text-sm text-zinc-500 font-medium mt-1">&quot;Très satisfait de mon achat, la consommation est bluffante en ville.&quot;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
