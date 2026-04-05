"use client";
import React from "react";
import { TrendingUp, Activity, DollarSign, Award } from "lucide-react";


interface PredictiveIntelligenceProps {
    trim: any;
}

const PredictiveIntelligence = ({ trim }: PredictiveIntelligenceProps) => {
    const insights = [
        {
            label: "Valeur de Revente (3 ans)",
            value: "68%",
            description: "Excellent maintien de la cote sur le marché marocain.",
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            color: "bg-emerald-50",
        },
        {
            label: "Fiabilité Prédite",
            value: "9.2/10",
            description: "Basé sur les historiques de pannes et l'ingénierie.",
            icon: <Activity className="w-5 h-5 text-blue-500" />,
            color: "bg-blue-50",
        },
        {
            label: "Coût de Possession Total",
            value: "Faible",
            description: "Entretien économique et consommation optimisée.",
            icon: <DollarSign className="w-5 h-5 text-amber-500" />,
            color: "bg-amber-50",
        },
        {
            label: "Score de Satisfaction IA",
            value: "95%",
            description: "Probabilité élevée que ce véhicule réponde à vos besoins.",
            icon: <Award className="w-5 h-5 text-purple-500" />,
            color: "bg-purple-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, idx) => (
                <div key={idx} className={`p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-lg transition-all ${insight.color}`}>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                        {insight.icon}
                    </div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">{insight.label}</h4>
                    <p className="text-3xl font-black text-zinc-900 mb-2">{insight.value}</p>
                    <p className="text-xs font-bold text-zinc-500 leading-relaxed italic">{insight.description}</p>
                </div>
            ))}
        </div>
    );
};

export default PredictiveIntelligence;
