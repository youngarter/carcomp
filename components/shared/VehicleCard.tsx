"use client";

import React from "react";
import { Zap, Wrench, Scale, Star, ArrowUpRight } from "lucide-react";
import { FinitionCard } from "@/types/car.types";
import Link from "next/link";
import Image from "next/image";

interface VehicleCardProps {
    trim: FinitionCard | any; // allow any for backward compatibility until all lists are updated
    onCompare?: (trim: FinitionCard | any) => void;
    isComparing?: boolean;
}

const VehicleCard = ({ trim, onCompare, isComparing }: VehicleCardProps) => {
    // Safety check for model data
    const carModel = trim.carModel;
    if (!carModel) return null;

    // Correct redirect URL based on Brand -> Model -> Finition
    const detailHref = `/car/${carModel.brand.slug}/${carModel.slug}/${trim.slug || trim.id}`;
    let imageSrc = "/images/placeholder-car.jpg";
    if (trim.images && Array.isArray(trim.images) && trim.images.length > 0) imageSrc = trim.images[0];
    else if (trim.image) imageSrc = trim.image;
    else if (carModel.image) imageSrc = carModel.image;
    const displayImage = imageSrc;
    const brandLogo = carModel.brand?.logo || "/images/placeholder-logo.png";

    // Promotion logic
    const currentPrice = trim.basePrice ? trim.basePrice / 100 : (trim.startPrice || 0);
    const promoHistory = trim.priceHistory?.[0] || trim.finitionPriceHistory?.[0] || {};
    const promoPrice = promoHistory.promotionalPrice ? promoHistory.promotionalPrice / 100 : (trim.promotionalPrice || 0);
    const isPromoted = typeof trim.priceHistory !== "undefined" ? (promoHistory.isPromotion || false) : (trim.isPromoted || false);
    const hasPromo = isPromoted && promoPrice > 0;
    const promoPercentage = hasPromo && currentPrice > 0 ? Math.round(((currentPrice - promoPrice) / currentPrice) * 100) : 0;
    const aiScore = (carModel.aiScore || 8.5).toFixed(1);

    return (
        <div className="bg-white rounded-[2.5rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgb(0,0,0,0.08)] transition-all duration-700 group flex flex-col relative border border-zinc-100/80 overflow-hidden h-full">
            {/* Image Container with Zoom effect */}
            <div className="aspect-[1.5/1] rounded-[2rem] mb-6 relative bg-zinc-50 overflow-hidden">
                <Image
                    src={displayImage}
                    alt={`${carModel.brand.name} ${carModel.name}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Brand Logo Overlay - Top Left */}
                <div className="absolute top-4 left-4 z-10 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <img src={brandLogo} alt={carModel.brand.name} className="w-7 h-7 object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>

                {/* AI Rating Badge - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                    <div className="px-3 py-1.5 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-2 shadow-2xl ring-1 ring-white/20">
                        <div className="flex flex-col items-center leading-none">
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter mb-0.5">AI RATING</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-black text-white">{aiScore}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promotion Badge - Bottom Left */}
                {hasPromo && (
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                            Promo
                        </div>
                        <div className="px-2.5 py-1.5 bg-amber-400 text-zinc-900 text-[9px] font-black rounded-full shadow-lg shadow-amber-400/20">
                            -{promoPercentage}%
                        </div>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex-1 px-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">{carModel.category}</span>
                        <h3 className="text-lg md:text-xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                            {carModel.brand.name} {carModel.name} <span className="text-zinc-400 font-medium text-base">{trim.name}</span>
                        </h3>
                    </div>
                </div>

                {/* Price Section - Inline */}
                <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-3 flex-wrap">
                        {hasPromo ? (
                            <>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-emerald-600 tracking-tight leading-none">
                                        {promoPrice.toLocaleString("fr-FR")}
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase">DH</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-400 line-through decoration-red-400/50">
                                    {currentPrice.toLocaleString("fr-FR")} DH
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-zinc-900 tracking-tight leading-none">
                                        {currentPrice.toLocaleString("fr-FR")}
                                    </span>
                                    <span className="text-[10px] font-black text-zinc-900 uppercase">DH</span>
                                </div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">À partir de</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="mt-auto grid grid-cols-5 gap-2 pt-6 border-t border-zinc-50">
                    {/* Noter (1/5) */}
                    <button className="col-span-1 h-12 rounded-2xl border-2 border-zinc-100 text-zinc-400 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 transition-all duration-300 flex items-center justify-center group/btn" title="Noter">
                        <Star className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>

                    {/* Comparer (1/5) */}
                    {onCompare && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onCompare(trim);
                            }}
                            className={`col-span-1 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${isComparing ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" : "border-zinc-100 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50"}`}
                            title="Comparer"
                        >
                            <Scale className="w-5 h-5" />
                        </button>
                    )}

                    {/* Découvrir (3/5 or 4/5) */}
                    <Link
                        href={detailHref}
                        className={`${onCompare ? "col-span-3" : "col-span-4"} h-12 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 group/btn`}
                    >
                        Découvrir
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Full Card Link overlay (except for buttons) */}
            <Link href={detailHref} className="absolute inset-0 z-0" aria-label={`Détails de ${carModel.brand.name} ${carModel.name}`} />
        </div>
    );
};

export default VehicleCard;
