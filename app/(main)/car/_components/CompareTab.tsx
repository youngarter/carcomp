"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, Fuel, Gauge, Zap } from "lucide-react";

interface CompareTabProps {
    carId: string;
    similarCars: any[];
}

export default function CompareTab({ carId, similarCars }: CompareTabProps) {
    return (
        <div className="bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
                <div>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Comparaison Intelligente</h3>
                    <p className="text-zinc-500 font-medium text-sm">L'IA vous propose automatiquement des véhicules du même segment, avec un budget et une énergie similaires.</p>
                </div>

                <button type="button" className="shrink-0 w-full sm:w-auto bg-zinc-900 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/20">
                    <ArrowLeftRight className="w-4 h-4" /> Comparer avec ce modèle
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {similarCars.map((car: any) => (
                    <Link key={car.id} href={`/car/${car.carModel.brand.slug}/${car.carModel.slug}/${car.slug}`} className="block group">
                        <div className="bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group-hover:-translate-y-2">
                            <div className="relative aspect-[4/3] bg-white">
                                <Image
                                    src={(car.images && car.images[0]) || car.carModel.image || "/placeholder-car.jpg"}
                                    alt={`${car.carModel.brand.name} ${car.carModel.name} ${car.name}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                    <ArrowLeftRight className="w-4 h-4 text-zinc-900" />
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{car.carModel.brand.name}</p>
                                <h4 className="font-black text-zinc-900 text-lg mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{car.carModel.name}</h4>
                                <p className="text-zinc-500 text-xs font-bold mb-4 line-clamp-1">{car.name}</p>

                                <div className="flex flex-col gap-2 mb-6">
                                    <span className="flex items-center gap-2 text-xs font-bold text-zinc-600 bg-white px-3 py-2 rounded-xl">
                                        <Fuel className="w-3 h-3 text-emerald-500" /> {car.technicalSpecs?.fuelType || "N/A"}
                                    </span>
                                    <span className="flex items-center gap-2 text-xs font-bold text-zinc-600 bg-white px-3 py-2 rounded-xl">
                                        <Zap className="w-3 h-3 text-amber-500" /> {car.technicalSpecs?.dinPower ? `${car.technicalSpecs.dinPower} ch` : "N/A"}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-zinc-200/50">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Prix estimé</p>
                                    <p className="font-black text-zinc-900 text-xl">{car.basePrice ? (car.basePrice / 100).toLocaleString('fr-FR') : "N/A"} <span className="text-[10px] text-zinc-400 font-bold uppercase">MAD</span></p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
