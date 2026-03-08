import React from "react";
import { Zap, Wrench, Scale, Star } from "lucide-react";
import { Car } from "../../../types/car";
import Link from "next/link";

interface VehicleCardProps {
    trim: Car;
    onCompare: (trim: Car) => void;
    onViewDetails: (trim: Car) => void;
    isComparing: boolean;
}

const VehicleCard = ({ trim, onCompare, isComparing }: VehicleCardProps) => {
    const detailHref = trim.slug ? `/car/${trim.slug}` : `/car/${trim.id}`;
    const displayImage = trim.image || trim.model?.imageUrl || "https://picsum.photos/seed/car/800/500";

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col relative border border-zinc-100/50">
            {/* Image Container */}
            <div className="aspect-[1.4/1] rounded-[1.5rem] mb-8 relative bg-zinc-50">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                    <img
                        src={displayImage}
                        alt={trim.model?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* AI Score Badge - Floating Top Right Edge */}
                <div className="absolute -top-3 -right-3 z-10 pointer-events-none">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.3)] border-[3px] border-emerald-500 ring-4 ring-white pointer-events-auto">
                        <span className="text-base font-black text-zinc-900">{(trim.model?.aiScore || 8.5).toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-2 mb-8">
                <h3 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight">
                    {trim.model?.brand?.name} {trim.model?.name}
                </h3>

                <div className="flex items-center gap-8 text-zinc-500">
                    <div className="flex items-center gap-2.5">
                        <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                        <span className="text-sm font-bold">{trim.specs?.moteur?.energie || "Électrique"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Wrench className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                        <span className="text-sm font-bold">{trim.model?.maintCost || 600} DH/an</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-100 w-full mb-8" />

            {/* Footer Row */}
            <div className="px-2 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        {trim.isPromoted && trim.promotionalPrice ? "EN PROMO" : "À PARTIR DE"}
                    </span>
                    {trim.isPromoted && trim.promotionalPrice ? (
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-400 line-through decoration-red-500/50 h-5" suppressHydrationWarning>
                                {trim.price.toLocaleString("fr-FR")}
                            </span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tight" suppressHydrationWarning>
                                {trim.promotionalPrice.toLocaleString("fr-FR")} DH
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-black text-zinc-900 tracking-tight mt-5" suppressHydrationWarning>
                            {trim.price.toLocaleString("fr-FR")} DH
                        </span>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onCompare(trim)}
                        className={`p-4 rounded-2xl border-2 transition-all ${isComparing ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" : "border-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}`}
                        title="Comparer"
                    >
                        <Scale className="w-5 h-5" />
                    </button>
                    <Link
                        href={detailHref}
                        className="px-8 py-4 rounded-2xl bg-zinc-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center shrink-0"
                    >
                        Détails
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
