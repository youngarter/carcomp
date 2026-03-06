"use client";
import React, { useState } from "react";
import { CheckCircle, ArrowRight, Wallet, Users, Zap, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Diagnostic = () => {
    const [step, setStep] = useState(0);
    const questions = [
        {
            id: "budget",
            question: "Quel est votre budget maximum ?",
            icon: <Wallet className="w-8 h-8 text-emerald-500" />,
            options: ["Moins de 150 000 DH", "150 000 - 300 000 DH", "300 000 - 500 000 DH", "Plus de 500 000 DH"],
        },
        {
            id: "usage",
            question: "Quelle est votre utilisation principale ?",
            icon: <Zap className="w-8 h-8 text-blue-500" />,
            options: ["Ville uniquement", "Mixte (Ville/Route)", "Autoroute / Longs trajets", "Tout-terrain / Rural"],
        },
        {
            id: "passengers",
            question: "Combien de passagers transportez-vous ?",
            icon: <Users className="w-8 h-8 text-purple-500" />,
            options: ["1-2 personnes", "Petite famille (3-4)", "Grande famille (5+)", "Transport professionnel"],
        },
        {
            id: "priority",
            question: "Quelle est votre priorité absolue ?",
            icon: <Heart className="w-8 h-8 text-rose-500" />,
            options: ["Économie / Consommation", "Confort / Technologie", "Sécurité / Robustesse", "Design / Prestige"],
        },
    ];

    const nextStep = () => {
        if (step < questions.length - 1) setStep(step + 1);
        else setStep(-1); // Finished
    };

    return (
        <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {step >= 0 ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-12 rounded-[40px] border border-black/5 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex gap-2">
                                {questions.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-emerald-500" : "w-1.5 bg-zinc-100"}`} />
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Question {step + 1}/{questions.length}</span>
                        </div>

                        <div className="mb-12">
                            <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-6">
                                {questions[step].icon}
                            </div>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight">{questions[step].question}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {questions[step].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={nextStep}
                                    className="group flex items-center justify-between p-6 rounded-2xl border border-zinc-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left"
                                >
                                    <span className="font-bold text-zinc-700 group-hover:text-emerald-900">{option}</span>
                                    <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-600 p-12 rounded-[40px] text-center text-white shadow-2xl"
                    >
                        <CheckCircle className="w-20 h-20 mx-auto mb-8 text-emerald-200" />
                        <h3 className="text-4xl font-black mb-4">Analyse en cours...</h3>
                        <p className="text-emerald-100 font-medium mb-12 opacity-80">Notre IA compare vos besoins avec plus de 2,400 configurations disponibles.</p>
                        <button
                            onClick={() => setStep(0)}
                            className="px-12 py-5 bg-white text-emerald-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-50 transition-all"
                        >
                            Voir mes recommandations
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Diagnostic;
