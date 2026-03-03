"use client";
import React from "react";
import { Star, Shield, Info, Scale } from "lucide-react";

interface VehicleCardProps {
    trim: any;
    onCompare: (trim: any) => void;
    onViewDetails: (trim: any) => void;
    isComparing: boolean;
}

const VehicleCard = ({ trim, onCompare, onViewDetails, isComparing }: VehicleCardProps) => {
    return (
        <div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group">
            <div className="aspect-[16/10] rounded-2xl bg-zinc-50 overflow-hidden mb-6 relative">
                <img
                    src={trim.model?.imageUrl || "https://picsum.photos/seed/car/800/500"}
                    alt={trim.model?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600" /> {trim.model?.aiScore || 8.5}
                    </div>
                    <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm flex items-center gap-1">
                        <Shield className="w-3 h-3 fill-blue-600" /> {trim.model?.reliability || 9.0}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
                    {trim.model?.brand?.name}
                </p>
                <h3 className="text-xl font-black text-zinc-900 leading-tight">
                    {trim.model?.name} <span className="text-zinc-400 font-bold">{trim.name}</span>
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Moteur</p>
                    <p className="text-xs font-bold text-zinc-900">{trim.specs?.moteur?.energie || "Hybride"}</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Entretien</p>
                    <p className="text-xs font-bold text-zinc-900">{trim.model?.maintCost || 600} DH/an</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-6 border-t border-zinc-50 mt-auto">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">À partir de</p>
                    <p className="text-lg font-black text-emerald-600" suppressHydrationWarning>{trim.price.toLocaleString("fr-FR")} DH</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onCompare(trim)}
                        className={`p-3 rounded-xl border transition-all ${isComparing ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner" : "border-zinc-100 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}`}
                    >
                        <Scale className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewDetails(trim)}
                        className="px-5 py-3 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                        Détails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
