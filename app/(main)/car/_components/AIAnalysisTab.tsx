"use client";
import React from "react";
import { Star, ShieldCheck, Wrench, Sparkles, ThumbsUp, ThumbsDown, UserCheck, Zap, Droplets, Gauge, Heart } from "lucide-react";

interface AIAnalysisTabProps {
    aiScore: number;
    reliability: number;
    maintCost: number;
    summary: string;
    pointsForts: string[];
    pointsFaibles: string[];
    recommandePour: string[];
    scores: {
        performance: number;
        economie: number;
        confort: number;
        technologie: number;
    };
}

export default function AIAnalysisTab({ aiScore, reliability, maintCost, summary, pointsForts, pointsFaibles, recommandePour, scores }: AIAnalysisTabProps) {
    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-emerald-500";
        if (score >= 6) return "text-amber-500";
        return "text-red-500";
    };

    const getBgColor = (score: number) => {
        if (score >= 8) return "bg-emerald-500";
        if (score >= 6) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Overall Score & Summary */}
            <div className="lg:col-span-5 flex flex-col gap-8">
                {/* Score Card */}
                <div className="bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-zinc-900 tracking-[0.2em] uppercase">Score IA Global</h3>
                    </div>

                    <div className="relative mb-6 flex items-center justify-center">
                        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-[12px] sm:border-[16px] border-zinc-50 flex items-center justify-center bg-white shadow-inner">

                            <div className="flex items-end justify-center leading-none">
                                <span className="text-5xl sm:text-7xl font-black text-zinc-900 tracking-tight tabular-nums">
                                    {aiScore.toFixed(1)}
                                </span>
                                <span className="text-lg sm:text-2xl font-bold text-zinc-400 ml-2 mb-2">
                                    /10
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-emerald-50/50 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 border border-emerald-100/50">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Résumé IA
                    </h4>
                    <p className="text-emerald-950 text-base leading-relaxed font-medium">
                        {summary}
                    </p>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                {/* Scoring Bars */}
                <div className="bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
                    <h4 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8">Analyse détaillée</h4>

                    <div className="space-y-6">
                        {[
                            { label: "Fiabilité", icon: <ShieldCheck className="w-4 h-4 text-zinc-400" />, score: reliability },
                            { label: "Performance", icon: <Zap className="w-4 h-4 text-zinc-400" />, score: scores.performance },
                            { label: "Économie", icon: <Droplets className="w-4 h-4 text-zinc-400" />, score: scores.economie },
                            { label: "Confort", icon: <Heart className="w-4 h-4 text-zinc-400" />, score: scores.confort },
                            { label: "Technologie", icon: <Gauge className="w-4 h-4 text-zinc-400" />, score: scores.technologie },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className={`text-sm font-black ${getScoreColor(item.score)}`}>{item.score.toFixed(1)}</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${getBgColor(item.score)}`}
                                        style={{ width: `${item.score * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pros/Cons & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
                        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4" /> Points forts
                        </h4>
                        <ul className="space-y-3">
                            {pointsForts.map((pt, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                                    {pt}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4" /> Points faibles
                        </h4>
                        <ul className="space-y-3">
                            {pointsFaibles.map((pt, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">✕</div>
                                    {pt}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recommended For */}
                <div className="bg-zinc-900 rounded-xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-zinc-800">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" /> Recommandé pour
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {recommandePour.map((rp, i) => (
                            <span key={i} className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm font-bold">
                                {rp}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
