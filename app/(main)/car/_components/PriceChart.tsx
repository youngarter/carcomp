"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PricePoint {
    price: number;
    date: Date;
}

interface PriceChartProps {
    history: PricePoint[];
}

export default function PriceChart({ history }: PriceChartProps) {
    if (!history || history.length < 2) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-zinc-100 flex flex-col items-center justify-center text-center h-full">
                <Minus className="w-12 h-12 text-zinc-200 mb-4" />
                <p className="text-zinc-500">Pas assez de données pour l'historique des prix.</p>
            </div>
        );
    }

    const sortedHistory = [...history].sort((a, b) => a.date.getTime() - b.date.getTime());
    const prices = sortedHistory.map(p => p.price);
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const range = maxPrice - minPrice;

    const latestPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const trend = latestPrice > firstPrice ? "up" : latestPrice < firstPrice ? "down" : "stable";

    // Simple SVG Path generation
    const width = 400;
    const height = 200;
    const padding = 20;

    const points = sortedHistory.map((p, i) => {
        const x = (i / (sortedHistory.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((p.price - minPrice) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-bold mb-1">Évolution du prix</h3>
                    <p className="text-zinc-500 text-sm">Prix catalogue historique</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-red-50 text-red-600" :
                        trend === "down" ? "bg-emerald-50 text-emerald-600" :
                            "bg-zinc-50 text-zinc-600"
                    }`}>
                    {trend === "up" && <TrendingUp className="w-3 h-3" />}
                    {trend === "down" && <TrendingDown className="w-3 h-3" />}
                    {trend === "stable" && <Minus className="w-3 h-3" />}
                    {trend === "up" ? "En hausse" : trend === "down" ? "En baisse" : "Stable"}
                </div>
            </div>

            <div className="relative w-full h-[200px] mb-8">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grids */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F4F4F5" strokeDasharray="4" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F4F4F5" strokeDasharray="4" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F4F4F5" strokeDasharray="4" />

                    {/* Price Line */}
                    <polyline
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={points}
                        className="drop-shadow-sm"
                    />

                    {/* Dots */}
                    {sortedHistory.map((p, i) => {
                        const x = (i / (sortedHistory.length - 1)) * (width - padding * 2) + padding;
                        const y = height - ((p.price - minPrice) / range) * (height - padding * 2) - padding;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="white"
                                stroke="#4F46E5"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <span>{sortedHistory[0].date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                <span>{sortedHistory[sortedHistory.length - 1].date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
            </div>
        </div>
    );
}
