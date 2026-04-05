"use client";
import React from "react";
import { Zap, Settings, Ruler, ShieldCheck, Car as CarIcon, Monitor } from "lucide-react";
import type { FinitionComplete } from "@/types/car.types";

interface TechnicalSpecsProps {
    finition: FinitionComplete;
}

import { SAFETY_LABELS, COMFORT_LABELS, AESTHETIC_LABELS } from "@/lib/constants/features";

const SpecItem = ({ label, value, isLast = false }: { label: string, value: string | number | null | undefined, isLast?: boolean }) => {
    if (value === null || value === undefined || value === "") return null;
    return (
        <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-zinc-100/50' : ''}`}>
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className="text-zinc-900 font-bold">{value}</span>
        </div>
    );
};

const DynamicOption = ({ label, value, defaultSuffix = "" }: { label: string, value: any, defaultSuffix?: string }) => {
    const isAvailable = value !== undefined && value !== null && value !== false && value !== "" && value !== "Aucun" && value !== "Aucune" && value !== "Non" && value !== "NONE";

    let displayValue = typeof value === 'boolean' || value === "Oui" || value === "OUI" ? null : value;

    return (
        <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isAvailable ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-zinc-50 border-zinc-100/50'}`}>
            <div className={`min-w-6 w-6 h-6 rounded-full flex items-center justify-center ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-400'}`}>
                {isAvailable ? <span className="text-xs font-bold">✓</span> : <span className="text-xs font-bold">✕</span>}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-zinc-900 truncate">{label}</span>
                {isAvailable && displayValue ? (
                    <span className="text-[10px] text-zinc-500 font-medium truncate">{displayValue}{defaultSuffix}</span>
                ) : (
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {isAvailable ? "Disponible" : "Non disponible"}
                    </span>
                )}
            </div>
        </div>
    );
};

export default function TechnicalSpecs({ finition }: TechnicalSpecsProps) {
    const ts = finition.technicalSpecs;
    const s = finition.safetyFeatures;
    const c = finition.comfortFeatures;
    const a = finition.aestheticFeatures;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* ENGINE */}
            <div className="rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" /> Moteur
                </h3>
                <SpecItem label="Energie" value={ts?.fuelType} />
                <SpecItem label="Puissance" value={ts?.dinPower ? `${ts.dinPower} ch` : null} />
                <SpecItem label="Cylindrée" value={ts?.engineDisplacement ? `${ts.engineDisplacement} cm³` : null} />
                <SpecItem label="Couple max" value={ts?.maxTorque ? `${ts.maxTorque} Nm` : null} />
                <SpecItem label="Transmission" value={ts?.transmission} />
                <SpecItem label="Puissance fiscale" value={ts?.fiscalPower ? `${ts.fiscalPower} CV` : null} />
                <SpecItem label="Capacité batterie" value={ts?.batteryCapacity ? `${ts.batteryCapacity} kWh` : null} />
                <SpecItem label="Autonomie électrique" value={ts?.electricRange ? `${ts.electricRange} km` : null} isLast />
            </div>

            {/* PERFORMANCE */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-500" /> Consommation & performances
                </h3>
                <SpecItem label="Conso. Mixte" value={ts?.consoMixed ? `${ts.consoMixed} L/100km` : null} />
                <SpecItem label="Conso. Ville" value={ts?.consoCity ? `${ts.consoCity} L/100km` : null} />
                <SpecItem label="Conso. Route" value={ts?.consoRoad ? `${ts.consoRoad} L/100km` : null} />
                <SpecItem label="Emission CO2" value={ts?.co2Emission ? `${ts.co2Emission} g/km` : null} />
                <SpecItem label="Vitesse Max" value={ts?.topSpeed ? `${ts.topSpeed} km/h` : null} />
                <SpecItem label="Accélération (0-100 km/h)" value={ts?.acceleration ? `${ts.acceleration}s` : null} isLast />
            </div>

            {/* DIMENSIONS */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-purple-500" /> Dimensions
                </h3>
                <SpecItem label="Places" value={ts?.seats} />
                <SpecItem label="Volume coffre" value={ts?.trunkVolume ? `${ts.trunkVolume} L` : null} />
                <SpecItem label="Volume réservoir" value={ts?.tankVolume ? `${ts.tankVolume} L` : null} />
                <SpecItem label="Poids à vide" value={ts?.weight ? `${ts.weight} kg` : null} />
                <SpecItem label="Longueur" value={ts?.length ? `${ts.length} mm` : null} />
                <SpecItem label="Largeur" value={ts?.width ? `${ts.width} mm` : null} />
                <SpecItem label="Hauteur" value={ts?.height ? `${ts.height} mm` : null} />
                <SpecItem label="Empattement" value={ts?.wheelbase ? `${ts.wheelbase} mm` : null} isLast />
            </div>

            {/* ESTHÉTIQUE */}
            <div className="rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group md:col-span-2">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-3">
                    <CarIcon className="w-5 h-5 text-indigo-500" /> Esthétique
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Object.entries(AESTHETIC_LABELS).map(([key, label]) => (
                        <DynamicOption key={key} label={label as string} value={a?.[key as keyof typeof a]} />
                    ))}
                </div>
            </div>

            {/* SAFETY */}
            <div className="rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group md:col-span-2">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-rose-500" /> Sécurité
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    <DynamicOption label="Airbags" value={s?.airbags} />
                    {Object.entries(SAFETY_LABELS).map(([key, label]) => {
                        if (key === 'airbags') return null;
                        return <DynamicOption key={key} label={label as string} value={s?.[key as keyof typeof s]} />;
                    })}
                </div>
            </div>

            {/* COMFORT & TECHNOLOGY */}
            <div className="rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group md:col-span-2">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-blue-500" /> Confort & Technologie
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Object.entries(COMFORT_LABELS).map(([key, label]) => (
                        <DynamicOption key={key} label={label as string} value={c?.[key as keyof typeof c]} />
                    ))}
                </div>
            </div>
        </div>
    );
}
