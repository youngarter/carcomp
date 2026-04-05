"use client";

import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingDown } from "lucide-react";

interface PriceHistoryChartProps {
    car: any; // Utilisation de any vu le typage dynamique côté client, tout en gardant une compatibilité large
}

export default function PriceHistoryChart({ car }: PriceHistoryChartProps) {
    const chartData = useMemo(() => {
        const data: any[] = [];

        // Validation stricte du prix initial
        const rawInitialPrice = car?.basePrice ? (car.basePrice / 100) : (car?.price ?? car?.startPrice);
        const initialPrice = Number(rawInitialPrice);
        const hasValidInitial = !isNaN(initialPrice) && initialPrice > 0;

        // On inclut le point de départ
        if (hasValidInitial) {
            data.push({
                dateLabel: "Lancement",
                timestamp: car?.createdAt ? new Date(car.createdAt).getTime() : new Date("2024-01-01").getTime(),
                price: initialPrice,
                isPromo: false
            });
        }

        // Récupération de l'historique de prix depuis FinitionPriceHistory
        const history = Array.isArray(car?.finitionPriceHistory) ? car.finitionPriceHistory : [];

        // Filtre et tri sécurisé des points valides
        const validHistory = history
            .filter((h: any) => h && h.promotionalPrice && h.startDate && !isNaN(Number(h.promotionalPrice)) && Number(h.promotionalPrice) > 0)
            .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        validHistory.forEach((h: any) => {
            const hPrice = car?.basePrice ? Number(h.promotionalPrice) / 100 : Number(h.promotionalPrice);
            const hDate = new Date(h.startDate);

            // On ajoute également si la date de fin existe pour ramener le prix au normal après la promo (facultatif mais plus précis)
            data.push({
                dateLabel: new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(hDate),
                timestamp: hDate.getTime(),
                price: hPrice,
                isPromo: true
            });

            if (h.endDate) {
                const endDate = new Date(h.endDate);
                if (endDate.getTime() < Date.now()) {
                    // La promo est finie, on revient au prix initial
                    data.push({
                        dateLabel: new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(endDate),
                        timestamp: endDate.getTime(),
                        price: initialPrice,
                        isPromo: false
                    });
                }
            }
        });

        // S'assurer de l'ordre complet
        data.sort((a, b) => a.timestamp - b.timestamp);

        // Déterminer le prix actuel pour le projeter jusqu'à "Aujourd'hui"
        let currentPrice = initialPrice;
        if (validHistory.length > 0) {
            const lastPromo = validHistory[validHistory.length - 1];
            if (!lastPromo.endDate || new Date(lastPromo.endDate).getTime() >= Date.now()) {
                currentPrice = car?.basePrice ? Number(lastPromo.promotionalPrice) / 100 : Number(lastPromo.promotionalPrice);
            }
        }

        // Pad le graphe jusqu'à "Aujourd'hui" s'il y a un prix valide
        if (hasValidInitial || validHistory.length > 0) {
            const lastTimestamp = data.length > 0 ? data[data.length - 1].timestamp : 0;
            if (lastTimestamp < Date.now()) {
                data.push({
                    dateLabel: "Aujourd'hui",
                    timestamp: Date.now(),
                    price: currentPrice,
                    isPromo: currentPrice !== initialPrice
                });
            }
        }

        return data;
    }, [car]);

    // Cas d'erreur / Données insuffisantes : 0 point, ou uniquement "Aujourd'hui" sans point initial valide.
    if (!chartData || chartData.length < 2) {
        return (
            <div className="p-12 bg-white rounded-[40px] border border-zinc-100 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-3">Historique non disponible</h3>
                <p className="text-sm text-zinc-500 max-w-sm font-medium leading-relaxed">
                    Pas assez de données pour afficher l'évolution du prix de ce véhicule.
                </p>
            </div>
        );
    }

    const formatYAxis = (tickItem: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            maximumFractionDigits: 0,
        }).format(tickItem);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const pointData = payload[0].payload;
            return (
                <div className="bg-zinc-900 text-white p-5 rounded-2xl shadow-2xl border border-zinc-800">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-2">{pointData.dateLabel}</p>
                    <p className={`text-xl font-black ${pointData.isPromo ? "text-emerald-400" : "text-white"}`}>
                        {new Intl.NumberFormat('fr-FR').format(pointData.price)} DH
                    </p>
                    {pointData.isPromo && (
                        <span className="inline-flex items-center gap-1 mt-3 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-lg tracking-wider">
                            <TrendingDown className="w-3 h-3" />
                            Prix Promotionnel
                        </span>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-5 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-[40px] border border-black/5 shadow-sm">
            <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-emerald-500" />
                Historique des prix
            </h3>

            <div className="h-[280px] sm:h-[350px] lg:h-[400px] w-full mt-6 sm:mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                        <XAxis
                            dataKey="dateLabel"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            domain={['dataMin - 10000', 'dataMax + 10000']}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }}
                            width={80}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e4e7', strokeWidth: 2, strokeDasharray: '4 4' }} />
                        <Line
                            type="stepAfter"
                            dataKey="price"
                            stroke="#10b981"
                            strokeWidth={4}
                            dot={{ fill: '#10b981', strokeWidth: 3, r: 6, stroke: '#fff' }}
                            activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 3, fill: '#fff' }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Légende */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-400" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Prix Standard</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">En Promotion</span>
                </div>
            </div>
        </div>
    );
}
