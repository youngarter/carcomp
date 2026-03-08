import React from "react";
import { ArrowRight } from "lucide-react";
import VehicleCard from "./VehicleCard";
import { Car } from "../../../types/car";

interface PromotionCarsProps {
    cars: Car[];
    onCompare: (car: Car) => void;
    comparingTrims: Car[];
}

const PromotionCars = ({ cars, onCompare, comparingTrims }: PromotionCarsProps) => {
    // Only show up to 8 promoted cars for the promotion section
    const displayCars = cars.filter(c => c.isPromoted).slice(0, 8);

    return (
        <section className="py-24 bg-[#FDFDFF]">
            <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                            Promotions <span className="text-emerald-500">du moment</span>
                        </h2>
                        <p className="text-lg text-zinc-500 font-medium max-w-xl">
                            Découvrez notre sélection des meilleures offres analysées et validées par notre IA.
                        </p>
                    </div>
                </div>

                {displayCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
                        {displayCars.map((car) => (
                            <VehicleCard
                                key={car.id}
                                trim={car}
                                onCompare={onCompare}
                                onViewDetails={() => { }}
                                isComparing={!!comparingTrims.find((ct) => ct.id === car.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-20 flex flex-col items-center justify-center bg-zinc-50 rounded-3xl border border-zinc-100">
                        <div className="w-16 h-16 border-4 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mb-6" />
                        <p className="text-zinc-500 font-medium">Chargement des véhicules...</p>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-zinc-100 text-zinc-900 font-black uppercase tracking-widest text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all group shadow-sm hover:shadow-md">
                        Voir plus de voitures
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PromotionCars;
