import React from "react";
import { Star, ShieldCheck, Wrench, Sparkles } from "lucide-react";

interface AIRatingBlockProps {
    aiScore: number;
    reliability: number;
    maintCost: number;
    summary: string;
}

export default function AIRatingBlock({ aiScore, reliability, maintCost, summary }: AIRatingBlockProps) {
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
        <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-zinc-100 h-full">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="text-xs font-black text-zinc-900 tracking-[0.2em] uppercase">AutoAdvisor AI</h3>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= Math.round(aiScore / 2) ? "fill-emerald-500 text-emerald-500" : "text-zinc-100"}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-8 mb-12">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-zinc-50 flex items-center justify-center">
                        <span className="text-5xl font-black text-zinc-900 tracking-tighter tabular-nums">{aiScore.toFixed(1)}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Score IA Global</p>
                    <p className="text-sm font-bold text-zinc-500 leading-tight">Analyse technique et retours experts.</p>
                </div>
            </div>

            <div className="space-y-8 mb-12">
                {/* Reliability */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-zinc-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fiabilité</span>
                        </div>
                        <span className={`text-xs font-black ${getScoreColor(reliability)}`}>{reliability.toFixed(1)}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${getBgColor(reliability)}`}
                            style={{ width: `${reliability * 10}%` }}
                        />
                    </div>
                </div>

                {/* Maintenance */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-zinc-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Maintenance</span>
                        </div>
                        <span className={`text-xs font-black ${getScoreColor(maintCost)}`}>{maintCost.toFixed(1)}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${getBgColor(maintCost)}`}
                            style={{ width: `${maintCost * 10}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100/50">
                <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">
                    "{summary}"
                </p>
            </div>
        </div>
    );
}
